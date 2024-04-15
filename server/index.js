import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import userRouter from "./router/user.route.js";
import authRouter from "./router/auth.route.js";

dotenv.config();
const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected To MongoDB!!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
