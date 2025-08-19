import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import config from "@/config/config";
import crypto from "crypto";

interface Props {
  params: Promise<{ token: string }>;
}

// Ensure the function signature matches the interface
export async function GET(_: Request, { params }: Props) {
  try {
    const { token } = await params; // Read the token from the URL params, NOT the request body

    // Hash the token from the URL to match the one in the database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user who has this verification token
    const user = await prisma.user.findUnique({
      where: { verificationToken: hashedToken },
    });

    if (!user) {
      throw new Error("Invalid or expired verification link.");
    }

    // If the user is found, verify them and clear the token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null, // Invalidate the token
      },
    });

    // Redirect the user to the login page with a success message
    const loginUrl = new URL("/login", config.clientUrl);
    loginUrl.searchParams.set("verified", "true");
    return NextResponse.redirect(loginUrl);
  } catch (error: any) {
    // If anything goes wrong, redirect to login with an error message
    const loginUrl = new URL("/login", config.clientUrl);
    loginUrl.searchParams.set("error", error.message || "Verification failed.");
    return NextResponse.redirect(loginUrl);
  }
}
