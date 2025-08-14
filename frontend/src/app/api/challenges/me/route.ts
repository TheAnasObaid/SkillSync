import dbConnect from "@/config/dbConnect";
import { getSession } from "@/lib/auth";
import { handleError } from "@/lib/handleError";
import Challenge from "@/models/Challenge";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "client") {
      throw new Error("Authentication required.");
    }

    await dbConnect();
    const challenges = await Challenge.find({
      createdBy: session.user._id,
    }).sort({ createdAt: -1 });

    return NextResponse.json(challenges);
  } catch (error) {
    return handleError(error);
  }
}
