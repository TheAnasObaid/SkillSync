import config from "@/config/config";
import { createBrandedEmail, sendEmail } from "@/lib/email";
import prisma from "@/lib/prisma";
import { emailSchema } from "@/lib/validationSchemas";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = emailSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });

    const successResponse = NextResponse.json({
      message:
        "If an account with that email exists and is unverified, a new link has been sent.",
    });

    // Only proceed if the user exists AND is not already verified.
    if (user && !user.isVerified) {
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const hashedVerificationToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");

      await prisma.user.update({
        where: { id: user.id },
        data: { verificationToken: hashedVerificationToken },
      });

      const verificationURL = `${config.clientUrl}/api/auth/verify-email/${verificationToken}`;

      const emailHtml = createBrandedEmail({
        title: "Resend Verification Email",
        name: user.firstName,
        body: "Please click the button below to activate your account.",
        buttonLink: verificationURL,
        buttonText: "Verify Your Email",
      });

      await sendEmail({
        to: user.email,
        subject: "SkillSync - Verify Your Email",
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
