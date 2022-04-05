import express from "express";

export defaultRouter = express.Router();

defaultRouter.use("/auth", authRoutes)

