import express from "express";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";

import { asyncHandler, generateError, verifyEmail } from "../utils/index";
import { UserModel } from "../models/User";

export const authRoutes = express.Router();

authRoutes.route("/login").post(
  asyncHandler(async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        throw new Error("Username and password required!");
      }

      const user = await UserModel.findOne({ username });

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ user_id: user._id, username }, process.env.TOKEN_KEY as Secret, {
          expiresIn: "2h",
        });

        user.token = token;

        res.status(200).json(user);
      } else {
        throw new Error("Password is incorrect!");
      }
    } catch (err) {
      res.status(400).send(generateError(err));
    }
  })
);

authRoutes.route("/register").post(
  asyncHandler(async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        throw new Error("All fields must be provided!");
      }

      if (!verifyEmail(email)) {
        throw new Error("Email is not valid!");
      }

      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
        throw new Error("User already exists!");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user in database
      const user = await UserModel.create({
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_KEY as Secret, {
        expiresIn: "2h",
      });

      user.token = token;

      res.status(201).json(user);
    } catch (err) {
      res.status(400).send(generateError(err));
    }
  })
);
