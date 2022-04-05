import express from "express";
import { taskRoutes } from "./task";

export const defaultRouter = express.Router();

defaultRouter.use("/tasks", taskRoutes);
