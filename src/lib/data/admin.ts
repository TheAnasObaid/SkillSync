import dbConnect from "@/lib/dbConnect";
import Challenge from "@/models/Challenge";
import Submission from "@/models/Submission";
import User from "@/models/User";
import { ISubmission, IUser, PlatformStats } from "@/types";
import "server-only"; // Ensures this code only runs on the server

import "@/models/User";
import "@/models/Challenge";

export const getPlatformStats = async (): Promise<PlatformStats> => {
  try {
    await dbConnect();
    const [
      totalUsers,
      totalChallenges,
      completedChallenges,
      pendingSubmissions,
    ] = await Promise.all([
      User.countDocuments(),
      Challenge.countDocuments(),
      Challenge.countDocuments({ status: "completed" }),
      Submission.countDocuments({ status: "pending" }),
    ]);
    return {
      totalUsers,
      totalChallenges,
      completedChallenges,
      pendingSubmissions,
    };
  } catch (error) {
    console.error("Database Error: Failed to fetch platform stats.", error);
    throw new Error("Could not fetch platform stats.");
  }
};

export const getAllUsers = async (): Promise<IUser[]> => {
  try {
    await dbConnect();
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error("Database Error: Failed to fetch all users.", error);
    throw new Error("Could not fetch users.");
  }
};

export const getAllSubmissions = async (): Promise<ISubmission[]> => {
  try {
    await dbConnect();
    const submissions = await Submission.find({})
      .populate("developerId", "profile.firstName email profile.avatar")
      .populate("challengeId", "title")
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(submissions));
  } catch (error) {
    console.error("Database Error: Failed to fetch all submissions.", error);
    throw new Error("Could not fetch submissions.");
  }
};
