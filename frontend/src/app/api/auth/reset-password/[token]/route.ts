import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";
import { handleError } from "@/lib/handleError";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters."),
});

interface Props {
  params: Promise<{ token: string }>;
}

export async function PATCH(request: Request, { params }: Props) {
  try {
    await dbConnect();
    const { token: resetToken } = await params;
    const body = await request.json();
    const { password } = resetPasswordSchema.parse(body);

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Token is invalid or has expired.");
    }

    user.password = password; // Pre-save hook will hash it
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Log the user in automatically for a better UX
    const token = generateToken(user);
    const userPayload = user.toObject();
    delete userPayload.password;

    (await cookies()).set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ user: userPayload, token });
  } catch (error) {
    return handleError(error);
  }
}
