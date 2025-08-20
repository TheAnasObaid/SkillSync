import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { ChallengeStatus, Role, SubmissionStatus } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ submissionId: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const { submissionId } = await params;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== Role.CLIENT) {
      return NextResponse.json(
        { message: "Forbidden: Must be a client to select a winner." },
        { status: 403 }
      );
    }

    const winningSubmission = await prisma.$transaction(async (tx) => {
      const submissionToWin = await tx.submission.findUnique({
        where: { id: submissionId },
        include: { challenge: true },
      });

      if (!submissionToWin) {
        throw new Error("Submission not found.");
      }

      const challenge = submissionToWin.challenge;

      if (challenge.createdById !== session.user.id) {
        throw new Error("Forbidden: You are not the owner of this challenge.");
      }
      if (!challenge.isFunded) {
        throw new Error("Cannot select a winner for an unfunded challenge.");
      }
      if (challenge.status === ChallengeStatus.COMPLETED) {
        throw new Error(
          "A winner has already been selected for this challenge."
        );
      }

      await tx.submission.updateMany({
        where: {
          challengeId: challenge.id,
          id: { not: submissionId },
        },
        data: { status: SubmissionStatus.REJECTED },
      });

      const winnerSubmission = await tx.submission.update({
        where: { id: submissionId },
        data: { status: SubmissionStatus.WINNER },
      });

      await tx.challenge.update({
        where: { id: challenge.id },
        data: { status: ChallengeStatus.COMPLETED },
      });

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

    if (error.message === "Submission not found.") {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    if (
      error.message.startsWith("Forbidden") ||
      error.message.startsWith("Cannot select")
    ) {
      return NextResponse.json({ message: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { message: "Failed to select winner." },
      { status: 500 }
    );
  }
}
