import "server-only";
import prisma from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import { ChallengeStatus, Role } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const getAllPublicChallenges = async () => {
  noStore();
  try {
    const challenges = await prisma.challenge.findMany({
      where: {
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
          select: {
            firstName: true,
            companyName: true,
            image: true,
          },
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
            image: true,
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
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== Role.CLIENT) {
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
