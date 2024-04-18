import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePersentage, setFilePersentage] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});

  //firebase storage rules =
  // allow read
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches("image/.*")

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const proggress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePersentage(Math.round(proggress));
      },
      (error) => {
        setFileError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  return (
    <div className="p-3 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          referrerPolicy="no-referrer"
          onClick={() => fileRef.current.click()}
          className="rounded-full h-32 w-32 object-cover hover:cursor-pointer self-center mt-2"
          src={formData.avatar || currentUser.avatar}
          alt=""
        />
        <p className="text-sm self-center">
          {fileError ? (
            <span className="text-red-700">
              Error Image Upload (Image must be less than 2 mb)
            </span>
          ) : filePersentage > 0 && filePersentage < 100 ? (
            <span className="text-slate-700">
              {`Uploading %${filePersentage}...`}
            </span>
          ) : filePersentage == 100 ? (
            <span className="text-green-700">Image Successfully Uploaded!</span>
          ) : (
            ""
          )}
        </p>
        {/* Username */}
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="border p-3 rounded-lg mt-5"
        />

        {/* Email */}
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
        />

        {/* Password */}
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
        />

        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-4">
        <span className="text-red-700 cursor-pointer font-semibold">
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer font-semibold">
          Sign Out
        </span>
      </div>
    </div>
  );
}
