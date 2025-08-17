import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { emailSchema } from "@/lib/validationSchemas";
import { createBrandedEmail, sendEmail } from "@/lib/email";
import config from "@/config/config";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = emailSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });

    const successResponse = NextResponse.json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: hashedResetToken,
          passwordResetExpires,
        },
      });

      const resetURL = `${config.clientUrl}/reset-password/${resetToken}`;
      const emailHtml = createBrandedEmail({
        title: "Password Reset Request",
        name: user.firstName,
        body: "We received a request to reset your password. Click the button below to choose a new one. This link is valid for 10 minutes.",
        buttonLink: resetURL,
        buttonText: "Reset Your Password",
      });

      await sendEmail({
        to: user.email,
        subject: "Your SkillSync Password Reset Link (Valid for 10 min)",
        html: emailHtml,
      });
    }

    return successResponse; // Always return success for security
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
