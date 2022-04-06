import express from "express";

import { authRoutes } from "./auth/routes";
import { postRoutes } from "./post/routes";
import { taskRoutes } from "./task/routes";

export const defaultRouter = express.Router();

defaultRouter.use("/auth", authRoutes);
defaultRouter.use("/posts", postRoutes);
defaultRouter.use("/tasks", taskRoutes);
