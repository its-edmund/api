import express from "express";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { v4 } from "uuid";
import { Twilio } from "twilio";

import { asyncHandler, generateError, verifyEmail } from "../../../utils/index";
import { UserModel, User } from "../models/user";
import { OTPRequestModel } from "../models/OTPRequest";

export const authRoutes = express.Router();

authRoutes.route("/status").get(
  asyncHandler(async (req, res) => {
    res.status(201).end("Authentication service is running!");
  })
);

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
          expiresIn: "7d",
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
      // res.status(400).send("Nice try, we're not taking new members.");
      const { username, email, password, phoneNumber } = req.body;

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
        phoneNumber,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign({ user_id: user._id, username }, process.env.TOKEN_KEY as Secret, {
        expiresIn: "7d",
      });

      user.token = token;

      res.status(201).json(user);
    } catch (err) {
      res.status(400).send(generateError(err));
    }
  })
);

authRoutes.route("/:id").delete(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new Error("User id is required to delete user!");
  }

  const deleteUser = await UserModel.findByIdAndDelete(id);

  res.status(204).send("User successfully deleted!");
});

authRoutes.route("/otp").post(
  asyncHandler(async (req, res) => {
    const { username } = req.body;

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const id = v4();

    const user = await UserModel.findOne({ username });

    if (!user) {
      throw new Error("User not found!");
    }

    await OTPRequestModel.create({
      userId: user._id,
      phoneNumber: user.phoneNumber,
      code,
      sessionId: id,
    });

    const accountSid = process.env.TWILIO_ACCOUNT_SID!;
    const authToken = process.env.TWILIO_AUTH_TOKEN!;
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

    const client = new Twilio(accountSid, authToken);

    await client.messages.create({
      from: twilioNumber,
      to: user.phoneNumber,
      body: `${code} is your OTP code.`,
    });

    res.status(200).json({ sessionId: id });
  })
);

authRoutes.route("/otp/verify").post(
  asyncHandler(async (req, res) => {
    const { sessionId, code } = req.body;

    const request = await OTPRequestModel.findOne({ sessionId });

    if (!request) {
      throw new Error("Session not found!");
    }

    console.log(request.code);

    if (request?.code !== code) {
      res.status(401).send("OTP code is incorrect!");
    } else {
      // Generate JWT token
      const token = jwt.sign({ user_id: request.userId }, process.env.TOKEN_KEY as Secret, {
        expiresIn: "7d",
      });
      res.status(200).send(token);
    }
  })
);
