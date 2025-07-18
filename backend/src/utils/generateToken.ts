import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();
const JWT_SECRET = process.env.JWT_SECRET!;

const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
};

export default generateToken;
