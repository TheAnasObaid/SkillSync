import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import Challenge from "../models/Challenge";
import Submission from "../models/Submission";
import User from "../models/User";
import asyncHandler from "../utils/asyncHandler";

// We wrap all the original functions with asyncHandler and get rid of try..catch

export const getPlatformStats = asyncHandler(
  async (_: AuthenticatedRequest, res: Response) => {
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
  }
);

export const getAllUsers = asyncHandler(
  async (_: AuthenticatedRequest, res: Response) => {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json(users);
  }
);

export const getAllSubmissions = asyncHandler(
  async (_: AuthenticatedRequest, res: Response) => {
    const submissions = await Submission.find({})
      .populate("developerId", "profile.firstName email")
      .populate("challengeId", "title")
      .sort({ createdAt: -1 });
    res.status(200).json(submissions);
  }
);

export const updateUserByAdmin = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.params;
    const { role, isVerified, accountStatus } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (role) user.role = role;
    if (isVerified !== undefined) user.isVerified = isVerified;
    if (accountStatus) user.accountStatus = accountStatus;

    await user.save({ validateBeforeSave: false });
    res.status(200).json(user);
  }
);

export const deleteChallengeByAdmin = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { challengeId } = req.params;
    const challenge = await Challenge.findByIdAndDelete(challengeId);

    if (!challenge) {
      res.status(404).json({ message: "Challenge not found" });
      return;
    }

    await Submission.deleteMany({ challengeId: challengeId });
    res.status(200).json({
      message: "Challenge and associated submissions deleted successfully",
    });
  }
);
