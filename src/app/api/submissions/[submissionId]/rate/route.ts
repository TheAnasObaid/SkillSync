import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { handleError } from "@/lib/handleError";
import Challenge from "@/models/Challenge";
import Submission from "@/models/Submission";
import User from "@/models/User";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ submissionId: string }>;
}

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "client") {
      throw new Error("Authentication required: Must be a client.");
    }

    const { rating, feedback } = await request.json();
    if (!rating)
      return NextResponse.json(
        { message: "Rating is required." },
        { status: 400 }
      );

    await dbConnect();

    const { submissionId } = await params;
    const submission = await Submission.findById(submissionId).populate({
      path: "challengeId",
      select: "createdBy",
    });

    if (!submission) throw new Error("Submission not found.");

    const challenge = await Challenge.findById(submission.challengeId);
    if (!challenge) throw new Error("Associated challenge not found.");

    if (
      (submission.challengeId as any).createdBy.toString() !== session.user._id
    ) {
      throw new Error("Forbidden: You are not the owner of this challenge.");
    }

    submission.ratings = { overall: rating };
    submission.feedback = feedback;

    if (challenge.status !== "completed") {
      submission.status = "reviewed";
    }
    await submission.save();

    const developer = await User.findById(submission.developerId);
    if (developer) {
      const oldTotalRating =
        developer.reputation.rating * developer.reputation.totalRatings;
      const newTotalRatings = developer.reputation.totalRatings + 1;

      developer.reputation.rating = (oldTotalRating + rating) / newTotalRatings;
      developer.reputation.totalRatings = newTotalRatings;
      await developer.save();
    }

    return NextResponse.json(submission);
  } catch (error) {
    return handleError(error);
  }
}
