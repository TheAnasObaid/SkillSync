import config from "@/config/config";
import { createBrandedEmail, sendEmail } from "@/lib/email";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validationSchemas";
import { Gender, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, email, password, role, gender } =
      registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "An account with that email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const user = await prisma.user.create({
      data: {
        firstName,
        email,
        password: hashedPassword,
        role: role === "developer" ? Role.DEVELOPER : Role.CLIENT,
        gender:
          gender === "male"
            ? Gender.MALE
            : gender === "female"
            ? Gender.FEMALE
            : Gender.OTHER,
        verificationToken: hashedVerificationToken,
      },
    });

    const verificationURL = `${config.clientUrl}/api/auth/verify-email/${verificationToken}`;
    const emailHtml = createBrandedEmail({
      title: "Welcome to SkillSync!",
      name: firstName,
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
    // Basic error handling, can be expanded
    console.error(error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
