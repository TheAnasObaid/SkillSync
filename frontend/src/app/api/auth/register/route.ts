import config from "@/config/config";
import dbConnect from "@/lib/dbConnect";
import { createBrandedEmail, sendEmail } from "@/lib/email";
import { handleError } from "@/lib/handleError";
import { registerSchema } from "@/lib/validationSchemas";
import User from "@/models/User";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const { name, email, password, role } = registerSchema.parse(body);

    const user = await User.create({
      "profile.firstName": name,
      email,
      password,
      role,
    });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    await user.save({ validateBeforeSave: false });

    const verificationURL = `${config.clientUrl}/verify-email/${verificationToken}`;
    const emailHtml = createBrandedEmail({
      title: "Welcome to SkillSync!",
      name,
      body: "Thank you for registering. Please click the button below to verify your email address and activate your account.",
      buttonLink: verificationURL,
      buttonText: "Verify Your Email",
    });

    await sendEmail({
      to: user.email,
      subject: "Welcome to SkillSync - Please Verify Your Email",
      html: emailHtml,
    });

    return NextResponse.json(
      {
        message:
          "Registration successful! Please check your email to verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
