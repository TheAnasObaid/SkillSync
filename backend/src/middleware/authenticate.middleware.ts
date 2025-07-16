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
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Not authorized" });
  }

  try {
    const token = authHeader?.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      const user = await User.findById(decoded.id);
      if (!user) res.status(401).json({ message: "User not found" });

      req.userId = decoded.id;
      next();
    }
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
