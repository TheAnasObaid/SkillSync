import dbConnect from "@/lib/dbConnect";
import { generateToken } from "@/lib/auth";
import { handleError } from "@/lib/handleError";
import { loginSchema } from "@/lib/validationSchemas";
import User from "@/models/User";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("Invalid credentials.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid credentials.");
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { message: "Please verify your email before logging in." },
        { status: 403 }
      );
    }

    if (user.accountStatus === "banned") {
      throw new Error("Forbidden: Your account has been suspended.");
    }

    const token = generateToken(user);
    const userPayload = user.toObject();
    delete userPayload.password;

    (await cookies()).set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ user: userPayload, token });
  } catch (error) {
    return handleError(error);
  }
}
