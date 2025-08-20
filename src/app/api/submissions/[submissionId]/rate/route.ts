import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { ChallengeStatus, Role } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { z } from "zod";

interface Params {
  params: Promise<{ submissionId: string }>;
}

const rateSubmissionSchema = z.object({
  rating: z.number().min(1).max(5),
  feedback: z.string().optional(),
});

export async function POST(request: Request, { params }: Params) {
  const { submissionId } = await params;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== Role.CLIENT) {
      return NextResponse.json(
        { message: "Forbidden: Must be a client to rate a submission." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { rating, feedback } = rateSubmissionSchema.parse(body);

    const updatedSubmission = await prisma.$transaction(async (tx) => {
      const submission = await tx.submission.findUnique({
        where: { id: submissionId },
        include: { challenge: { select: { createdById: true, status: true } } },
      });

      if (!submission) {
        throw new Error("Submission not found.");
      }

      if (submission.challenge.createdById !== session.user.id) {
        throw new Error("Forbidden: You are not the owner of this challenge.");
      }

      const updateData: any = { rating, feedback };
      if (submission.challenge.status !== ChallengeStatus.COMPLETED) {
        updateData.status = "REVIEWED";
      }

      const currentSubmission = await tx.submission.update({
        where: { id: submissionId },
        data: updateData,
      });

      const developer = await tx.user.findUnique({
        where: { id: currentSubmission.developerId },
        select: { rating: true, totalRatings: true },
      });

      if (developer) {
        const oldTotalRatingValue = developer.rating * developer.totalRatings;
        const newTotalRatings = developer.totalRatings + 1;
        const newAverageRating =
          (oldTotalRatingValue + rating) / newTotalRatings;

        await tx.user.update({
          where: { id: currentSubmission.developerId },
          data: {
            rating: newAverageRating,
            totalRatings: newTotalRatings,
          },
        });
      }

      return currentSubmission;
    });

    return NextResponse.json(updatedSubmission);
  } catch (error: any) {
    console.error(`POST /api/submissions/${submissionId}/rate Error:`, error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid rating data provided." },
        { status: 400 }
      );
    }

    if (error.message === "Submission not found.") {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    if (error.message.startsWith("Forbidden")) {
      return NextResponse.json({ message: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { message: "Failed to rate submission." },
      { status: 500 }
    );
  }
}
