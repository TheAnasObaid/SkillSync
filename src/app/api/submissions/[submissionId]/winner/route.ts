import dbConnect from "@/lib/dbConnect";
import { getSession } from "@/lib/auth";
import { handleError } from "@/lib/handleError";
import Challenge from "@/models/Challenge";
import Submission from "@/models/Submission";
import User from "@/models/User";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ submissionId: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "client") {
      throw new Error("Authentication required: Must be a client.");
    }

    await dbConnect();

    const { submissionId } = await params;
    const winningSubmission = await Submission.findById(submissionId);
    if (!winningSubmission) throw new Error("Submission not found.");

    const challenge = await Challenge.findById(winningSubmission.challengeId);
    if (!challenge) throw new Error("Challenge not found.");

    // Security checks
    if (challenge.createdBy.toString() !== session.user._id)
      throw new Error("Forbidden: You are not the owner of this challenge.");
    if (!challenge.isFunded)
      throw new Error("Cannot select a winner for an unfunded challenge.");
    if (challenge.status === "completed")
      throw new Error("A winner has already been selected for this challenge.");

    // Update challenge and winning submission
    challenge.status = "completed";
    winningSubmission.status = "winner";

    // Update other submissions to 'rejected'
    await Submission.updateMany(
      { challengeId: challenge._id, _id: { $ne: winningSubmission._id } },
      { status: "rejected" }
    );

    // Update winner's earnings and reputation
    const winner = await User.findById(winningSubmission.developerId);
    if (winner) {
      winner.earnings += challenge.prize;
      winner.reputation.completedChallenges += 1;
      await winner.save();
    }

    await challenge.save();
    await winningSubmission.save();

    return NextResponse.json(winningSubmission);
  } catch (error) {
    return handleError(error);
  }
}
