import dbConnect from "@/lib/dbConnect";
import { getSession } from "@/lib/auth";
import { handleError } from "@/lib/handleError";
import Submission from "@/models/Submission";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "admin") {
      throw new Error("Forbidden: Admin access required.");
    }

    await dbConnect();

    const submissions = await Submission.find({})
      .populate("developerId", "profile.firstName email profile.avatar")
      .populate("challengeId", "title")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(submissions);
  } catch (error) {
    return handleError(error);
  }
}
