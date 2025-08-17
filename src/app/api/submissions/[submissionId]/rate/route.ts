import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ChallengeStatus, Role } from "@prisma/client";

interface Params {
  params: Promise<{ submissionId: string }>;
}

export async function POST(request: Request, { params }: Params) {
  const { submissionId } = await params;

  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== Role.CLIENT) {
      return NextResponse.json(
        { message: "Authentication required: Must be a client." },
        { status: 401 }
      );
    }

    const { rating, feedback } = await request.json();
    if (!rating) {
      return NextResponse.json(
        { message: "Rating is required." },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: { challenge: { select: { createdById: true, status: true } } },
    });

    if (!submission) {
      return NextResponse.json(
        { message: "Submission not found." },
        { status: 404 }
      );
    }

    // Security check: ensure the user rating is the one who created the challenge
    if (submission.challenge.createdById !== session.user.id) {
      return NextResponse.json(
        { message: "Forbidden: You are not the owner of this challenge." },
        { status: 403 }
      );
    }

    const updateData: any = {
      rating: rating,
      feedback: feedback,
    };

    if (submission.challenge.status !== ChallengeStatus.COMPLETED) {
      updateData.status = "REVIEWED";
    }

    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: updateData,
    });

    // TODO: Add logic to recalculate developer's average rating.

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error(`POST /api/submissions/${submissionId}/rate Error:`, error);
    return NextResponse.json(
      { message: "Failed to rate submission." },
      { status: 500 }
    );
  }
}
