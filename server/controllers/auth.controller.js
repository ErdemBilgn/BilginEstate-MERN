import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Sign Up function
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User Created Successfully!", user: newUser });
  } catch (err) {
    next(errorHandler(err.statusCode, err.message));
  }
};

// Sign In function
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(401, "Invalid Credentials!"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Invalid Credentials!"));

    const token = jwt.sign(
      { id: validUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(rest);
  } catch (err) {
    next(errorHandler(err.statusCode, err.message));
  }
};

// Google signin-signup function
export const google = async (req, res, next) => {
  const { name, email, photoURL } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET);

      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),

        email,
        password: hashedPassword,
        avatar: photoURL,
      });

      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id },
        process.env.ACCESS_TOKEN_SECRET
      );
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(rest);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Signout function
export const signout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "User has been logged out" });
  } catch (err) {
    next(err);
  }
};
