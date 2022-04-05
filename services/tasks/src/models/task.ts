import { model, Schema } from "mongoose";
export interface Task {
  name: string;
  date: number;
  completed: boolean;
}

const taskSchema = new Schema<Task>({
  name: { type: String, required: true },
  date: { type: Number, required: false },
  completed: { type: Boolean, required: true, default: false },
});

export const TaskModel = model<Task>("Task", taskSchema);
