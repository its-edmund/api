import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { defaultRouter } from "./routes/index";
import morgan from "morgan";

export const app = express();

const PORT = process.env.PORT || 8003;

mongoose
  .connect("mongodb://localhost", {
    dbName: "tasks",
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

app.listen(8003, () => {
  console.log(`TASKS services started on port ${8003}`);
});
