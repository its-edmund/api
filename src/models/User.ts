import { Schema, model } from "mongoose";

export interface User {
  username: string;
  email: string;
  password: string;
  token: string;
}

const userSchema = new Schema<User>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String },
});

export const UserModel = model<User>("User", userSchema);
