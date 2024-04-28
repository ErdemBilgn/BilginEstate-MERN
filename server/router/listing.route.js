import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// Create listing route
router.post("/create", verifyToken, createListing);

// Delete listing route
router.delete("/delete/:id", verifyToken, deleteListing);

// Update listing route
router.post("/update/:id", verifyToken, updateListing);

// Get listings with search queries route
router.get("/get", getListings);

// Get single listing route
router.get("/:id", getListing);

export default router;
