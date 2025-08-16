import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { handleError } from "@/lib/handleError";
import Challenge from "@/models/Challenge";
import User from "@/models/User";
import Submission from "@/models/Submission";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ challengeId: string }>;
}

export async function GET(request: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "client") {
      throw new Error(
        "Authentication required: Must be a client to review submissions."
      );
    }

    const { challengeId } = await params;
    await dbConnect();

    const challenge = await Challenge.findById(challengeId).select("createdBy");
    if (!challenge) {
      throw new Error("Challenge not found.");
    }

    if (challenge.createdBy.toString() !== session.user._id) {
      throw new Error(
        "Forbidden: You are not authorized to view these submissions."
      );
    }

    const submissions = await Submission.find({ challengeId })
      .populate("developerId", "profile.firstName email profile.avatar")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(submissions);
  } catch (error) {
    return handleError(error);
  }
}
