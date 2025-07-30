import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { verifyToken } from "../services/tokenService";
import { IUser, Role } from "../types";
import asyncHandler from "../utils/asyncHandler";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
  userId?: string;
}

export const authenticate = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ message: "Authentication invalid: No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      res
        .status(401)
        .json({ message: "Authentication invalid: User not found" });
      return;
    }

    if (user.accountStatus === "banned") {
      res.status(403).json({ message: "Access forbidden: User is banned" });
      return;
    }

    req.user = user;
    req.userId = user.id;
    next();
  }
);

export const authorize =
  (requiredRole: Role) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === requiredRole) {
      next();
    } else {
      res
        .status(403)
        .json({ message: `Access forbidden: Requires ${requiredRole} role` });
    }
  };
