import config from "@/config/config";
import dbConnect from "@/lib/dbConnect";
import { createBrandedEmail, sendEmail } from "@/lib/email";
import { handleError } from "@/lib/handleError";
import { emailSchema } from "@/lib/validationSchemas";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { email } = emailSchema.parse(body);

    const user = await User.findOne({ email });

    const successResponse = NextResponse.json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });

    if (user) {
      const resetToken = user.createPasswordResetToken();
      await user.save({ validateBeforeSave: false });

      const resetURL = `${config.clientUrl}/reset-password/${resetToken}`;

      const emailHtml = createBrandedEmail({
        title: "Password Reset Request",
        name: user.profile.firstName,
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
    return handleError(error);
  }
}
