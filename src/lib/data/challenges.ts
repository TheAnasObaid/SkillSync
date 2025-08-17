import "server-only";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { unstable_noStore as noStore } from "next/cache";
import { ChallengeStatus } from "@prisma/client";

export const getAllPublicChallenges = async () => {
  noStore();
  try {
    const challenges = await prisma.challenge.findMany({
      where: {
        // Only fetch challenges that should be publicly visible
        status: {
          in: [
            ChallengeStatus.PUBLISHED,
            ChallengeStatus.JUDGING,
            ChallengeStatus.COMPLETED,
          ],
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: {
          select: { firstName: true, companyName: true, avatarUrl: true },
        },
        _count: {
          select: { submissions: true },
        },
      },
    });
    return challenges;
  } catch (error) {
    console.error("Database Error: Failed to fetch public challenges.", error);
    throw new Error("Could not fetch challenges.");
  }
};

export const getChallengeById = async (id: string) => {
  noStore();
  try {
    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            companyName: true,
            avatarUrl: true,
          },
        },
      },
    });
    return challenge;
  } catch (error) {
    console.error(
      `Database Error: Failed to fetch challenge by ID: ${id}`,
      error
    );
    throw new Error("Could not fetch challenge.");
  }
};

export const getMyChallengesAsClient = async () => {
  noStore();
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "CLIENT") {
      // Return empty array if not a client or not logged in, to avoid errors
      return [];
    }

    const challenges = await prisma.challenge.findMany({
      where: { createdById: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    });
    return challenges;
  } catch (error) {
    console.error(
      "Database Error: Failed to fetch client's challenges.",
      error
    );
    throw new Error("Could not fetch your challenges.");
  }
};
