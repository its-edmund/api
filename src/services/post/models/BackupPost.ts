import { Schema, model } from "mongoose";

export interface BackupPost {
  title: string;
  body: string;
  timestamp: number;
}

const backupPostSchema = new Schema<BackupPost>({
  title: { type: String, required: true },
  body: { type: String, required: true },
  timestamp: { type: Number, required: true, default: Date.now() },
});

export const BackupPostModel = model<BackupPost>("BackupPost", backupPostSchema);
