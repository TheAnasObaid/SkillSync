import mongoose from "mongoose";
import appConfig from "./config";

async function connectDB() {
  try {
    await mongoose.connect(appConfig.mongoUri!);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed", err);
    process.exit(1);
  }
}

export default connectDB;
