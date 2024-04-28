import express from "express";
import {
  google,
  signin,
  signout,
  signup,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Signup route
router.post("/signup", signup);

// Signin route
router.post("/signin", signin);

// Google signin-signup route
router.post("/google", google);

// Signout route
router.get("/signout", signout);

export default router;
