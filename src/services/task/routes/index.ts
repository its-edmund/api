import express from "express";
import jwt from "jsonwebtoken";

import { verifyToken } from "../../../middleware/auth";
import { TaskModel } from "../models/Task";

export const taskRoutes = express.Router();

taskRoutes.route("/status").get(async (req, res) => {
  res.status(200).send("Task service is running!");
});

taskRoutes.use(verifyToken);

taskRoutes.route("/").post(async (req, res) => {
  const { name, date, completed, token } = req.body;

  const decoded = jwt.decode(token, { complete: true }) as any;

  if (!name) {
    throw new Error("Name is required!");
  }

  const newTask = await TaskModel.create({
    name,
    date,
    completed,
    userId: decoded.payload.user_id,
  });

  res.status(200).json(newTask);
});

taskRoutes.route("/").get(async (req, res) => {
  const tasks = await TaskModel.find();

  res.status(200).json(tasks);
});

taskRoutes.route("/:id").delete(async (req, res) => {
  const { id } = req.params;

  await TaskModel.findByIdAndDelete(id);

  res.status(200).send("Task deleted");
});

taskRoutes.route("/toggle/:id").patch(async (req, res) => {
  const { id } = req.params;
  const task = await TaskModel.findById(id);

  if (!task) {
    throw new Error("Task not found");
  }

  await TaskModel.update({ _id: id }, { $set: { completed: !task.completed } });

  res.status(200).send("Task toggled");
});

taskRoutes.route("/:id").patch(async (req, res) => {
  const { id } = req.params;
  const { name, date } = req.body;
  const task = await TaskModel.findById(id);

  if (!task) {
    throw new Error("Task not found");
  }

  await TaskModel.findByIdAndUpdate(id, { name, date });

  res.status(200).send("Task updated");
});
