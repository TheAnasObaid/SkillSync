import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ChallengeStatus, Role, SubmissionStatus } from "@prisma/client";

interface Params {
  params: Promise<{ submissionId: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const { submissionId } = await params;

  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== Role.CLIENT) {
      return NextResponse.json(
        { message: "Authentication required: Must be a client." },
        { status: 401 }
      );
    }

    // Use a transaction to ensure all database updates succeed or fail together
    const winningSubmission = await prisma.$transaction(async (tx) => {
      const submissionToWin = await tx.submission.findUnique({
        where: { id: submissionId },
        include: { challenge: true },
      });

      if (!submissionToWin) throw new Error("Submission not found.");

      const challenge = submissionToWin.challenge;

      // Security Checks
      if (challenge.createdById !== session.user.id)
        throw new Error("Forbidden: You are not the owner of this challenge.");
      if (!challenge.isFunded)
        throw new Error("Cannot select a winner for an unfunded challenge.");
      if (challenge.status === ChallengeStatus.COMPLETED)
        throw new Error(
          "A winner has already been selected for this challenge."
        );

      // 1. Update other submissions to 'REJECTED'
      await tx.submission.updateMany({
        where: {
          challengeId: challenge.id,
          id: { not: submissionId },
        },
        data: { status: SubmissionStatus.REJECTED },
      });

      // 2. Update the winning submission
      const winnerSubmission = await tx.submission.update({
        where: { id: submissionId },
        data: { status: SubmissionStatus.WINNER },
      });

      // 3. Update the challenge status to 'COMPLETED'
      await tx.challenge.update({
        where: { id: challenge.id },
        data: { status: ChallengeStatus.COMPLETED },
      });

      // 4. Update the winner's earnings and reputation
      await tx.user.update({
        where: { id: submissionToWin.developerId },
        data: {
          earnings: { increment: challenge.prize },
          completedChallenges: { increment: 1 },
        },
      });

      return winnerSubmission;
    });

    return NextResponse.json(winningSubmission);
  } catch (error: any) {
    console.error(
      `PATCH /api/submissions/${submissionId}/winner Error:`,
      error
    );
    return NextResponse.json(
      { message: error.message || "Failed to select winner." },
      { status: 400 }
    );
  }
}
