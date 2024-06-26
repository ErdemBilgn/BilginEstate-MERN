import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function CreateListing() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handles the Image upload functionality
  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });

          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image Upload Failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing!");
      setUploading(false);
    }
  };

  // Stores the Image(s) to the firebase storage
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  // Handles Removing image
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((url, i) => i !== index),
    });
  };

  // Handles for changes
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (e.target.type === "text" || e.target.type === "textarea") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }

    if (e.target.type === "number") {
      setFormData({
        ...formData,
        [e.target.id]: parseInt(e.target.value),
      });
    }
  };

  // Handles Submitting the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");

      if (formData.regularPrice < formData.discountedPrice)
        return setError("Discounted Price must be lower than Regular Price");
      setLoading(true);
      setError(false);

      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Listing has been created!",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create A Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/* First Col */}
        <div className="flex flex-col gap-4 flex-1">
          {/* Name */}
          <input
            value={formData.name}
            onChange={handleChange}
            type="text"
            id="name"
            placeholder="Name"
            className="border p-3 rounded-lg"
            maxLength={62}
            minLength={10}
            required
          />

          {/* Description */}
          <textarea
            value={formData.description}
            onChange={handleChange}
            type="text"
            id="description"
            placeholder="Description"
            className="border p-3 rounded-lg"
            required
          />

          {/* Adress */}
          <input
            value={formData.address}
            onChange={handleChange}
            type="text"
            id="address"
            placeholder="Address"
            className="border p-3 rounded-lg"
            required
          />

          {/* Checkboxes */}
          <div className="flex gap-6 flex-wrap my-6">
            <div className="flex gap-2">
              <input
                checked={formData.type == "sale"}
                onChange={handleChange}
                type="checkbox"
                id="sale"
                className="w-5 "
              />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input
                checked={formData.type == "rent"}
                onChange={handleChange}
                type="checkbox"
                id="rent"
                className="w-5 "
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                checked={formData.parking}
                onChange={handleChange}
                type="checkbox"
                id="parking"
                className="w-5 "
              />
              <span>Parking Spot</span>
            </div>

            <div className="flex gap-2">
              <input
                checked={formData.furnished}
                onChange={handleChange}
                type="checkbox"
                id="furnished"
                className="w-5 "
              />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input
                checked={formData.offer}
                onChange={handleChange}
                type="checkbox"
                id="offer"
                className="w-5 "
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                value={formData.bedrooms}
                onChange={handleChange}
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                value={formData.bathrooms}
                onChange={handleChange}
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>Baths</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                value={formData.regularPrice}
                onChange={handleChange}
                type="number"
                id="regularPrice"
                min={50}
                max={10000000}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                {formData.type === "rent" && (
                  <span className="text-xs">($ / Month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  value={formData.discountedPrice}
                  onChange={handleChange}
                  type="number"
                  id="discountedPrice"
                  min={0}
                  max={10000000}
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>

                  {formData.type === "rent" && (
                    <span className="text-xs">($ / Month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Second Col */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold ">
            Images:{" "}
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => {
                setFiles(e.target.files);
              }}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={index}
                className="flex justify-between p-3 border items-center rounded-lg"
              >
                <img src={url} className="w-24 object-contain rounded-lg" />

                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  DELETE
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
