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

// Update a user's details (role, verification status, etc.)
export const updateUserByAdmin = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const { role, isVerified, accountStatus } = req.body;

    // Find the user and update only the specified fields
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (role) user.role = role;
    if (isVerified !== undefined) user.isVerified = isVerified;
    if (accountStatus) user.accountStatus = accountStatus;

    await user.save({ validateBeforeSave: false }); // Bypass certain validations if needed

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update user" });
  }
};

// Delete any challenge on the platform
export const deleteChallengeByAdmin = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { challengeId } = req.params;
    const challenge = await Challenge.findByIdAndDelete(challengeId);
    if (!challenge) {
      res.status(404).json({ message: "Challenge not found" });
      return;
    }
    // Optional: Also delete all related submissions
    await Submission.deleteMany({ challengeId: challengeId });
    res.status(200).json({
      message: "Challenge and associated submissions deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete challenge" });
  }
};
