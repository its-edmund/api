import { Schema, model } from "mongoose";

enum Priority {
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
}

export interface Post {
  title: string;
  body: string;
  timestamp: number;
  userId: string;
  priority: Priority;
}

const postSchema = new Schema<Post>({
  title: { type: String, required: true },
  body: { type: String, required: true },
  timestamp: { type: Number, required: true, default: Date.now() },
  userId: { type: String, required: true },
});

export const PostModel = model<Post>("Post", postSchema);
