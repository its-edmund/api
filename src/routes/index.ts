import express from "express";

import { authRoutes } from "./auth";
import { postRoutes } from "./posts";
import { ssoRoutes } from "./sso";

export const defaultRouter = express.Router();

defaultRouter.use("/auth", authRoutes);
defaultRouter.use("/posts", postRoutes);
defaultRouter.use("/sso", ssoRoutes);
