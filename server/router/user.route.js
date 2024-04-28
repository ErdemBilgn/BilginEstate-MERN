import express from "express";
import {
  deleteUser,
  getUser,
  getUserListings,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// Update user route
router.post("/update/:id", verifyToken, updateUser);

// Delete user route
router.delete("/delete/:id", verifyToken, deleteUser);

// Get Users Listings route
router.get("/listings/:id", verifyToken, getUserListings);

// Get single user route
router.get("/:id", verifyToken, getUser);

export default router;
