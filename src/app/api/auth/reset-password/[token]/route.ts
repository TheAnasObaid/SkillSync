import { generateToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters."),
});

interface Props {
  params: Promise<{ token: string }>;
}

export async function PATCH(request: Request, { params }: Props) {
  try {
    const { token: resetToken } = await params;
    const body = await request.json();
    const { password } = resetPasswordSchema.parse(body);

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new Error("Token is invalid or has expired.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    const token = generateToken(updatedUser);
    const { password: _, ...userPayload } = updatedUser;

    (await cookies()).set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ user: userPayload, token });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || "An internal server error occurred." },
      { status: 400 }
    );
  }
}
