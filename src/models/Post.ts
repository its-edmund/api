import { Schema, model } from "mongoose";

export interface Post {
  title: string;
  body: string;
  timestamp: number;
}

const postSchema = new Schema<Post>({
  title: { type: String, required: true },
  body: { type: String, required: true },
  timestamp: { type: Number, required: true, default: Date.now() },
});

export const PostModel = model<Post>("Post", postSchema);
