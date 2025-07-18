import cors from "cors";
import { config } from "dotenv";
import express from "express";
import connectDB from "./config/database";
import authRouter from "./routes/auth";
import challengesRouter from "./routes/challenges";

const app = express();

config();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/challenges", challengesRouter);

app.listen(process.env.PORT, () =>
  console.log("Listening on http://localhost:" + process.env.PORT)
);
