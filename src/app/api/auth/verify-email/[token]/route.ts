import config from "@/config/config";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import crypto from "crypto";
import { NextResponse } from "next/server";

interface Props {
  params: Promise<{ token: string }>;
}

export async function GET(_: Request, { params }: Props) {
  try {
    const { token } = await params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await dbConnect();
    const user = await User.findOne({ verificationToken: hashedToken });
    if (!user) {
      throw new Error("Invalid or expired verification link.");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save({ validateBeforeSave: false });

    const loginUrl = new URL("/login", config.clientUrl);
    loginUrl.searchParams.set("verified", "true");
    return NextResponse.redirect(loginUrl);
  } catch (error: any) {
    const loginUrl = new URL("/login", config.clientUrl);
    loginUrl.searchParams.set("error", error.message || "Verification failed.");
    return NextResponse.redirect(loginUrl);
  }
}
