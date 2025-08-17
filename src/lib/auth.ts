import config from "@/config/config";
import { Role, User } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import "server-only";

const JWT_SECRET = config.jwtSecret!;

interface SessionPayload extends JwtPayload {
  id: string;
  role: Role;
}

export const generateToken = (user: User): string => {
  const payload: SessionPayload = {
    id: user.id,
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
      id: decoded.id,
      role: decoded.role,
    },
  };
};
