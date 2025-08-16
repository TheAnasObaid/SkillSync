import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { handleError } from "@/lib/handleError";
import dbConnect from "@/lib/dbConnect";
import Submission from "@/models/Submission";
import User from "@/models/User";
import Challenge from "@/models/Challenge";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "developer") {
      throw new Error("Authentication required: Must be a developer.");
    }

    await dbConnect();

    const submissions = await Submission.find({ developerId: session.user._id })
      .populate("challengeId", "title status prize")
      .sort({ createdAt: -1 });

    return NextResponse.json(submissions);
  } catch (error) {
    return handleError(error);
  }
}
