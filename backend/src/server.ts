import cors from "cors";
import { config } from "dotenv";
import express from "express";
import connectDB from "./config/database";
import authRouter from "./routes/auth";
import challengesRoute from "./routes/challenges";
import submissionsRoute from "./routes/submissions";

const app = express();

config();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/challenges", challengesRoute);
app.use("/api/submissions", submissionsRoute);

app.listen(process.env.PORT, () =>
  console.log("Listening on http://localhost:" + process.env.PORT)
);
