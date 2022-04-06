import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import Bottleneck from "bottleneck";

// import bodyParser from "body-parser";

import { defaultRouter } from "./services";
import { handleError } from "./middleware/handleErrors";

mongoose.connect(process.env.MONGODB_URI as string).catch(err => {
  throw err;
});

export const app = express();
const PORT = process.env.PORT || 8000;

const limiter = new Bottleneck({
  minTime: 10000,
  maxConcurrent: 1,
});

app.use(
  cors({
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/status", (req, res) => {
  res.send("works");
});

app.get("/", (req, res) => {
  res.redirect("/zen");
});

app.get("/zen", (req, res) => {
  const zen = [
    "It's not fully shipped until it's fast.",
    "Practicality beats purity.",
    "Avoid administrative distraction.",
    "Mind your words, they are important.",
    "Non-blocking is better than blocking.",
    "Design for failure.",
    "Half measures are as bad as nothing at all.",
    "Favor focus over features.",
    "Approachable is better than simple.",
    "Encourage flow.",
    "Anything added dilutes everything else.",
    "Speak like a human.",
    "Responsive is better than fast.",
    "Keep it logically awesome.",
  ];

  res.status(200).send(zen[Math.floor(Math.random() * zen.length)]);
});

app.use("/", defaultRouter);

app.use(handleError);

app.listen(PORT, () => {
  console.log(`Service started on port ${PORT}`);
});
