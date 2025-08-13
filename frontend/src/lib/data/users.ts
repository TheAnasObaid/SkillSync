import dbConnect from "@/config/dbConnect";
import Challenge from "@/models/Challenge";
import Submission from "@/models/Submission";
import User from "@/models/User";
import { ClientStats, DeveloperStats, IUser } from "@/types";
import { unstable_noStore as noStore } from "next/cache";
import "server-only";
import { getSession } from "../auth";

export const getMyProfile = async (): Promise<IUser | null> => {
  noStore();
  try {
    const session = await getSession();
    if (!session?.user) return null;

    await dbConnect();
    const user = await User.findById(session.user._id)
      .select("-password")
      .lean();
    return user ? JSON.parse(JSON.stringify(user)) : null;
  } catch (error) {
    console.error(
      "Database Error: Failed to fetch current user's profile.",
      error
    );
    throw new Error("Could not fetch your profile.");
  }
};

export const getPublicUserProfile = async (
  userId: string
): Promise<IUser | null> => {
  noStore();
  try {
    await dbConnect();
    const user = await User.findById(userId).select("profile reputation role");
    if (!user || user.role !== "developer") return null;
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error(
      `Database Error: Failed to fetch public user profile for ${userId}.`,
      error
    );
    throw new Error("Could not fetch user profile.");
  }
};

export const getMyDeveloperStats = async (): Promise<DeveloperStats | null> => {
  noStore();
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "developer") return null;

    await dbConnect();
    const developerId = session.user._id;
    const [totalSubmissions, winningSubmissions, pendingReviews] =
      await Promise.all([
        Submission.countDocuments({ developerId }),
        Submission.countDocuments({ developerId, status: "winner" }),
        Submission.countDocuments({ developerId, status: "pending" }),
      ]);
    return { totalSubmissions, winningSubmissions, pendingReviews };
  } catch (error) {
    console.error("Database Error: Failed to fetch developer stats.", error);
    throw new Error("Could not fetch developer stats.");
  }
};

export const getMyClientStats = async (): Promise<ClientStats | null> => {
  noStore();
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "client") return null;

    await dbConnect();
    const clientId = session.user._id;
    const challenges = await Challenge.find({ createdBy: clientId })
      .select("_id status")
      .lean();
    const challengeIds = challenges.map((c) => c._id);

    const totalChallengesPosted = challenges.length;
    const activeChallenges = challenges.filter(
      (c) => c.status === "active"
    ).length;
    const totalSubmissionsReceived = await Submission.countDocuments({
      challengeId: { $in: challengeIds },
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
