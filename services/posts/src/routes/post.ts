import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { verifyToken } from "../../../../common/src/middleware/auth";
import { PostModel } from "../models/Post";
import { BackupPostModel } from "../models/BackupPost";
import { asyncHandler } from "../../../../common/src/utils";

export const postRoutes = express.Router();

postRoutes.route("/status").get(
  asyncHandler(async (req, res) => {
    res.send("Post service is running!");
  })
);

postRoutes.use(verifyToken);

postRoutes.route("/add").post(
  asyncHandler(async (req, res) => {
    const { body, title, token } = req.body;

    const decoded = jwt.decode(token, { complete: true }) as any;

    const newPost = await PostModel.create({
      body,
      title,
      timestamp: Date.now(),
      userId: decoded.payload.user_id,
    });

    const newBackupPost = await BackupPostModel.create({
      body,
      title,
      timestamp: Date.now(),
      userId: decoded.payload.user_id,
    });

    res.status(200).send(`Post ${newPost.id} successfully posted!`);
  })
);

postRoutes.route("/:id").delete(
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid id provided!");
    }

    const post = await PostModel.findOneAndDelete({
      _id: id,
    });

    res.status(200).send(`Post successfully deleted!`);
  })
);

postRoutes.route("/:id").patch(
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, body } = req.body;

    if (!title || !body) {
      throw new Error("Fields are missing to edit!");
    }

    const post = await PostModel.findOneAndUpdate(
      { _id: id },
      {
        title,
        body,
      }
    );
  })
);

postRoutes.route("/:id").get(
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const post = await PostModel.findById(id);

    res.status(200).json(post);
  })
);
interface JwtPayload {
  _id: string;
}

postRoutes.route("/").post(
  asyncHandler(async (req, res) => {
    const { token } = req.body;

    if (!token) {
      throw new Error("Missing user token!");
    }

    console.log(token);

    const decoded = jwt.decode(token, { complete: true }) as any;

    const posts = await PostModel.find({ userId: decoded.payload.user_id });

    res.status(200).json(posts);
  })
);
