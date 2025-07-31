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
  (...requiredRoles: Role[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    // 2. We check if the user's role is included in the list of allowed roles.
    const hasRequiredRole = requiredRoles.includes(req.user.role);

    if (!hasRequiredRole) {
      res.status(403).json({
        message: `Access Forbidden: Requires one of the following roles: ${requiredRoles.join(
          ", "
        )}`,
      });
      return;
    }

    // 3. If everything is okay, we proceed.
    next();
  };
