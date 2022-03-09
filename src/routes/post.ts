import express from "express";
import mongoose from "mongoose";

import { verifyToken } from "../middleware/auth";
import { PostModel } from "../models/Post";
import { BackupPostModel } from "../models/BackupPost";
import { asyncHandler } from "../utils";

export const postRoutes = express.Router();

postRoutes.route("/status").get(
  asyncHandler(async (req, res) => {
    res.send("Post service is running!");
  })
);

postRoutes.use(verifyToken);

postRoutes.route("/add").post(
  asyncHandler(async (req, res) => {
    const { body, title } = req.body;

    const newPost = await PostModel.create({
      body,
      title,
      timestamp: Date.now(),
    });

    const newBackupPost = await BackupPostModel.create({
      body,
      title,
      timestamp: Date.now(),
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

postRoutes.route("/").get(
  asyncHandler(async (req, res) => {
    const posts = await PostModel.find();

    res.status(200).json(posts);
  })
);
