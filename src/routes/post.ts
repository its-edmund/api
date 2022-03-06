import express from "express";
import { PostModel } from "../models/Post";
import { asyncHandler } from "../utils";

export const postRoutes = express.Router();

postRoutes.route("/status").get(
  asyncHandler(async (req, res) => {
    res.send("Post service is running!");
  })
);

postRoutes.route("/add").post(
  asyncHandler(async (req, res) => {
    const { body, title } = req.body;

    const newPost = await PostModel.create({
      body,
      title,
    });

    res.status(200).send(`Post ${newPost.id} successfully posted!`);
  })
);

postRoutes.route("/").get(asyncHandler((req, res) => {}));