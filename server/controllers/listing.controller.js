import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

// Create Listing function
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
};

// Delete listing function
export const deleteListing = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) return next(errorHandler(404, "Listing could not found!"));

  if (req.user.id !== listing.userRef)
    return next(errorHandler(401, "You can only delete your own listings!"));

  try {
    await Listing.findByIdAndDelete(id);
    res.status(200).json({ message: "Listing has been deleted" });
  } catch (err) {
    next(err);
  }
};

// Update listing function
export const updateListing = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) return next(errorHandler(404, "Listing could not found!"));

  if (req.user.id !== listing.userRef)
    return next(errorHandler(401, "You can only update your own listings"));

  try {
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json(updatedListing);
  } catch (err) {
    next(err);
  }
};

// Get a single listing function
export const getListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) return next(errorHandler(404, "Listing could not found!"));

    res.status(200).json(listing);
  } catch (err) {
    next(err);
  }
};

// Get all listings with given query function
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["rent", "sale"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (err) {
    next(err);
  }
};
