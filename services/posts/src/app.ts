import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { defaultRouter } from "./routes/index";
import morgan from "morgan";

export const app = express();

const PORT = process.env.PORT || 8003;

mongoose
  .connect("mongodb://localhost", {
    dbName: "posts",
  })
  .catch(err => {
    throw err;
  });

app.use(morgan("dev"));
app.use(
  cors({
    origin: true,
    preflightContinue: true,
    credentials: true,
  })
);
app.use(express.json());
app.get("/status", (req, res) => {
  res.status(200).end();
});

app.use("/", defaultRouter);

app.listen(8002, () => {
  console.log(`POSTS services started on port ${8002}`);
});
