import config from "@/config/config";
import dbConnect from "@/lib/dbConnect";
import { createBrandedEmail, sendEmail } from "@/lib/email";
import { handleError } from "@/lib/handleError";
import { emailSchema } from "@/lib/validationSchemas";
import User from "@/models/User";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { email } = emailSchema.parse(body);

    const user = await User.findOne({ email });

    const successResponse = NextResponse.json({
      message:
        "If an account with that email exists and is unverified, a new link has been sent.",
    });

    if (user && !user.isVerified) {
      const verificationToken = crypto.randomBytes(32).toString("hex");
      user.verificationToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");
      await user.save({ validateBeforeSave: false });

      const verificationURL = `${config.clientUrl}/verify-email/${verificationToken}`;

      const emailHtml = createBrandedEmail({
        title: "Resend Verification Email",
        name: user.profile.firstName,
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
    return handleError(error);
  }
}
