import cors from "cors";
import { config } from "dotenv";
import express from "express";
import path from "path";
import connectDB from "./config/database";
import errorHandler from "./middleware/errorHandler";
import adminRoute from "./routes/adminRoutes";
import authRoute from "./routes/authRoutes";
import challengesRoute from "./routes/challengeRoutes";
import submissionsRoute from "./routes/submissionRoutes";
import userRoute from "./routes/userRoutes";

const app = express();

config();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/users", userRoute);
app.use("/api/submissions", submissionsRoute);
app.use("/api/challenges", challengesRoute);

// IMPORTANT: The error handler must be the LAST middleware added.
app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log("Listening on http://localhost:" + process.env.PORT)
);
