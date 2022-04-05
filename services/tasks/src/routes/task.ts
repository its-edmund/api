import express from "express";
import { TaskModel } from "../models/task";

export const taskRoutes = express.Router();

taskRoutes.route("/").post(async (req, res) => {
  const { name, date, completed } = req.body;

  if (!name) {
    throw new Error("Name is required!");
  }

  const newTask = await TaskModel.create({
    name,
    date,
    completed,
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
