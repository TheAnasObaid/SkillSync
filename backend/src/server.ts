import express from "express";
import authRoute from "./routes/auth.routes";
import cors from "cors";
import { config } from "dotenv";

const app = express();
config();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);

app.listen(process.env.PORT, () =>
  console.log("Listening on http://localhost:" + process.env.PORT)
);
