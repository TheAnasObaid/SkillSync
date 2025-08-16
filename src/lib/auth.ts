import config from "@/config/config";
import { IUser, Role } from "@/types";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import "server-only";

const JWT_SECRET = config.jwtSecret!;

interface SessionPayload extends JwtPayload {
  id: string;
  role: Role;
}

export const generateToken = (user: IUser): string => {
  const payload: SessionPayload = {
    id: user._id,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string): SessionPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return null;
  }
};

export const getSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return null;
  }

  return {
    isLoggedIn: true,
    user: {
      _id: decoded.id,
      role: decoded.role,
    },
  };
};
