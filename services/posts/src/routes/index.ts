import express from "express";
import { postRoutes } from "./post";

export const defaultRouter = express.Router();

defaultRouter.use("/post", postRoutes);
