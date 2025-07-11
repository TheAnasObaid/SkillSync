import cors from "cors";
import { config } from "dotenv";
import express from "express";
import connectDB from "./config/database";
import authRoute from "./routes/auth.routes";
import { authenticate } from "./middleware/authenticate.middleware";
import { authorize } from "./middleware/authorize.middleware";

const app = express();

config();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);

app.get("/developer", authenticate, authorize("developer"), (req, res) => {
  res.json({ message: "Developer profile" });
});

app.get("/client", authenticate, authorize("client"), (req, res) => {
  res.json({ message: "Client profile" });
});

app.listen(process.env.PORT, () =>
  console.log("Listening on http://localhost:" + process.env.PORT)
);
