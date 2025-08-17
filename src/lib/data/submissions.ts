import prisma from "@/lib/prisma";
import { SubmissionStatus } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";
import "server-only";

export const getPublicSubmissionsForChallenge = async (challengeId: string) => {
  noStore();
  try {
    const submissions = await prisma.submission.findMany({
      where: {
        challengeId: challengeId,
        // For public view, you might only want to show winners, or all non-pending
        status: { in: [SubmissionStatus.WINNER, SubmissionStatus.REJECTED] },
      },
      orderBy: { createdAt: "desc" },
      include: {
        developer: {
          select: {
            id: true,
            firstName: true,
            avatarUrl: true,
          },
        },
      },
    });
    return submissions;
  } catch (error) {
    console.error("Database Error: Failed to fetch public submissions.", error);
    throw new Error("Could not fetch submissions.");
  }
};

export const getSubmissionDetails = async (submissionId: string) => {
  noStore();
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        developer: true,
        challenge: true,
      },
    });
    return submission;
  } catch (error) {
    console.error("Database Error: Failed to fetch submission details.", error);
    throw new Error("Could not fetch submission details.");
  }
};
