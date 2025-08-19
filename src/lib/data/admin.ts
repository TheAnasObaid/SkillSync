import prisma from "@/lib/prisma";
import { ChallengeStatus, SubmissionStatus } from "@prisma/client";
import "server-only";

export const getPlatformStats = async () => {
  try {
    const stats = await prisma.$transaction([
      prisma.user.count(),
      prisma.challenge.count(),
      prisma.challenge.count({ where: { status: ChallengeStatus.COMPLETED } }),
      prisma.submission.count({ where: { status: SubmissionStatus.PENDING } }),
    ]);
    return {
      totalUsers: stats[0],
      totalChallenges: stats[1],
      completedChallenges: stats[2],
      pendingSubmissions: stats[3],
    };
  } catch (error) {
    console.error("Database Error: Failed to fetch platform stats.", error);
    throw new Error("Could not fetch platform stats.");
  }
};

export const getUsersForAdminPanel = async () => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        role: true,
        accountStatus: true,
        emailVerified: true,
        createdAt: true,
        firstName: true,
        lastName: true,
        image: true,
        name: true,
      },
    });
    return users;
  } catch (error) {
    console.error(
      "Database Error: Failed to fetch users for admin panel.",
      error
    );
    throw new Error("Could not fetch users.");
  }
};
