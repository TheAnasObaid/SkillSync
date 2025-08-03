// ===== File: backend\src\services\tokenService.ts =====
import jwt from "jsonwebtoken";
import appConfig from "../config/config";
// FIX: No longer need the full IUser type, just the Role
import { Role } from "../types";

const JWT_SECRET = appConfig.jwtSecret!;
const JWT_EXPIRES_IN = "7d";

/**
 * Generates a JWT for a given user payload.
 * FIX: The function now accepts a plain object with only the required data.
 * This is more robust than passing a full Mongoose document.
 * @param userPayload The user's ID and role.
 * @returns The generated JWT.
 */
export const generateToken = (userPayload: {
  id: string;
  role: Role;
}): string => {
  return jwt.sign({ id: userPayload.id, role: userPayload.role }, JWT_SECRET, {
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
    throw new Error("Invalid or expired token");
  }
};
