import { model, Schema } from "mongoose";

export interface Task {
  name: string;
  date: number;
  completed: boolean;
  userId: string;
}

const taskSchema = new Schema<Task>({
  name: { type: String, required: true },
  date: { type: Number, required: false },
  completed: { type: Boolean, required: true, default: false },
  userId: { type: String, required: true },
});

export const TaskModel = model<Task>("Task", taskSchema);
