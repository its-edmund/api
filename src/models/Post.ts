import { Schema, model } from "mongoose";

export interface Post {
  title: string;
  body: string;
  timestamp: number;
  userId: string;
}

const postSchema = new Schema<Post>({
  title: { type: String, required: true },
  body: { type: String, required: true },
  timestamp: { type: Number, required: true, default: Date.now() },
  userId: { type: String, required: true },
});

export const PostModel = model<Post>("Post", postSchema);
