import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import appConfig from "../config/config";

const JWT_SECRET = appConfig.jwtSecret!;
const JWT_EXPIRES_IN = "7d";

/**
 * Generates a JWT for a given user ID.
 * @param userId The ID of the user.
 * @returns The generated JWT.
 */
export const generateToken = (userId: Types.ObjectId | string): string => {
  return jwt.sign({ id: userId.toString() }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verifies a JWT and returns its decoded payload.
 * @param token The JWT to verify.
 * @returns The decoded payload containing the user ID.
 */
export const verifyToken = (token: string): { id: string } => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string };
  } catch (error) {
    // You can handle different error types like TokenExpiredError here
    throw new Error("Invalid or expired token");
  }
};
