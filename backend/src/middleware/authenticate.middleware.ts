import { config } from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { User as IUser } from "../models/user.model";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
  userId?: string;
}

config();
const JWT_SECRET = process.env.JWT_SECRET!;

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = String(req.headers.authorization);

  if (!token) {
    res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({ message: "User not found" });
    }

    req.userId = decoded.id;

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
