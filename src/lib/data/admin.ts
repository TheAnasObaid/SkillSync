import "server-only";
import prisma from "@/lib/prisma";

export const getPlatformStats = async () => {
  try {
    const stats = await prisma.$transaction([
      prisma.user.count(),
      prisma.challenge.count(),
      prisma.challenge.count({ where: { status: "COMPLETED" } }),
      prisma.submission.count({ where: { status: "PENDING" } }),
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

export const getAllUsers = async () => {
  try {
    // Prisma is type-safe. We can explicitly select the fields we want,
    // which automatically excludes the password.
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        role: true,
        accountStatus: true,
        isVerified: true,
        createdAt: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Database Error: Failed to fetch all users.", error);
    throw new Error("Could not fetch users.");
  }
};
