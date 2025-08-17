import "server-only";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { unstable_noStore as noStore } from "next/cache";
import { ChallengeStatus, SubmissionStatus, Role } from "@prisma/client";

export const getMyProfile = async () => {
  noStore();
  try {
    const session = await getSession();
    if (!session?.user) return null;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        portfolio: { orderBy: { createdAt: "desc" } },
        submissions: {
          orderBy: { createdAt: "desc" },
          include: {
            challenge: {
              select: { id: true, title: true, prize: true },
            },
          },
        },
      },
    });

    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error(
      "Database Error: Failed to fetch current user's profile.",
      error
    );
    throw new Error("Could not fetch your profile.");
  }
};

export const getPublicUserProfile = async (userId: string) => {
  noStore();
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId, role: Role.DEVELOPER }, // Only allow viewing public developer profiles
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        bio: true,
        skills: true,
        experience: true,
        rating: true,
        totalRatings: true,
        completedChallenges: true,
        portfolio: true,
      },
    });
    return user;
  } catch (error) {
    console.error(
      `Database Error: Failed to fetch public user profile for ${userId}.`,
      error
    );
    throw new Error("Could not fetch user profile.");
  }
};

export const getMyDeveloperStats = async () => {
  noStore();
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== Role.DEVELOPER) return null;

    const developerId = session.user.id;
    const stats = await prisma.$transaction([
      prisma.submission.count({ where: { developerId } }),
      prisma.submission.count({
        where: { developerId, status: SubmissionStatus.WINNER },
      }),
      prisma.submission.count({
        where: { developerId, status: SubmissionStatus.PENDING },
      }),
    ]);

    return {
      totalSubmissions: stats[0],
      winningSubmissions: stats[1],
      pendingReviews: stats[2],
    };
  } catch (error) {
    console.error("Database Error: Failed to fetch developer stats.", error);
    throw new Error("Could not fetch developer stats.");
  }
};

export const getMyClientStats = async () => {
  noStore();
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== Role.CLIENT) return null;

    const clientId = session.user.id;
    const challenges = await prisma.challenge.findMany({
      where: { createdById: clientId },
      select: { id: true, status: true },
    });
    const challengeIds = challenges.map((c) => c.id);

    const totalChallengesPosted = challenges.length;
    const activeChallenges = challenges.filter(
      (c) =>
        c.status === ChallengeStatus.PUBLISHED ||
        c.status === ChallengeStatus.JUDGING
    ).length;
    const totalSubmissionsReceived = await prisma.submission.count({
      where: { challengeId: { in: challengeIds } },
    });

    return {
      totalChallengesPosted,
      activeChallenges,
      totalSubmissionsReceived,
    };
  } catch (error) {
    console.error("Database Error: Failed to fetch client stats.", error);
    throw new Error("Could not fetch client stats.");
  }
};
