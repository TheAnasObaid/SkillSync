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

export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const getAllSubmissions = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const submissions = await Submission.find({})
      .populate("developerId", "profile.firstName email")
      .populate("challengeId", "title")
      .sort({ createdAt: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
};
