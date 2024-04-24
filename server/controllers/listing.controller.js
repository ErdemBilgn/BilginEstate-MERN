import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
};

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
