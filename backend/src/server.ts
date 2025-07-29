import cors from "cors";
import { config } from "dotenv";
import express from "express";
import connectDB from "./config/database";
import adminRoute from "./routes/admin";
import authRoute from "./routes/auth";
import challengesRoute from "./routes/challenges";
import submissionsRoute from "./routes/submissions";
import userRoute from "./routes/user";

const app = express();

config();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/users", userRoute);
app.use("/api/challenges", challengesRoute);
app.use("/api/submissions", submissionsRoute);

app.listen(process.env.PORT, () =>
  console.log("Listening on http://localhost:" + process.env.PORT)
);
