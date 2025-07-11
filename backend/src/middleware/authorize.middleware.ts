import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { AuthenticatedRequest } from "./authenticate.middleware";

type Role = "developer" | "client" | "admin";

export const authorize = (requiredRole: Role) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.userId) res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(req.userId);

    if (!user) res.status(401).json({ message: "User not found" });

    if (user && user.role !== requiredRole)
      res
        .status(403)
        .json({ message: `Forbidden: ${requiredRole} role required` });

    req.user = user!;

    next();
  };
};
