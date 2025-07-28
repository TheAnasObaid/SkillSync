import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import Challenge from "../models/Challenge";
import Submission from "../models/Submission";
import User from "../models/User";

export const getPlatformStats = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalChallenges = await Challenge.countDocuments();
    const completedChallenges = await Challenge.countDocuments({
      status: "completed",
    });
    const pendingSubmissions = await Submission.countDocuments({
      status: "pending",
    });

    res.status(200).json({
      totalUsers,
      totalChallenges,
      completedChallenges,
      pendingSubmissions,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch platform stats" });
  }
};
