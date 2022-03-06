import express, {Request, Response} from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";

// import bodyParser from "body-parser";

import { defaultRouter } from "./routes";

mongoose.connect(process.env.MONGODB_URI as string).catch(err => {
  throw err;
});

export const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/status", (req, res) => {
  res.send("works")
})

app.use(defaultRouter);

app.listen(PORT, () => {
  console.log(`Authentication service started on port ${PORT}`);
});
