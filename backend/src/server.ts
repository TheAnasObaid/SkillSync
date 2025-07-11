import cors from "cors";
import { config } from "dotenv";
import express, { Response } from "express";
import connectDB from "./config/database";
import { AuthenticatedRequest, protect } from "./middleware/auth.middleware";
import authRoute from "./routes/auth.routes";

const app = express();

config();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.get("/me", protect, (req: AuthenticatedRequest, res: Response) => {
  res.json({ userId: req.userId });
});

app.listen(process.env.PORT, () =>
  console.log("Listening on http://localhost:" + process.env.PORT)
);
