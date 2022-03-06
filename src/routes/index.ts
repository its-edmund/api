import express from "express";

import { authRoutes } from "./auth";
import { postRoutes } from "./post";

export const defaultRouter = express.Router();

defaultRouter.use("/auth", authRoutes);
defaultRouter.use("/posts", postRoutes);
