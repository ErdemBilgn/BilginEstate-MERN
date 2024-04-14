import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./router/user.route.js";

dotenv.config();
const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected To MongoDB!!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/user", userRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
