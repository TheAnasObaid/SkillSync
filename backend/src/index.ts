import cors from "cors";
import { config } from "dotenv";
import express from "express";
import path from "path";
import connectDB from "./config/database";
import errorHandler from "./middleware/errorHandler";
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

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/users", userRoute);
app.use("/api/challenges", challengesRoute);
app.use("/api/submissions", submissionsRoute);

// IMPORTANT: The error handler must be the LAST middleware added.
app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log("Listening on http://localhost:" + process.env.PORT)
);
