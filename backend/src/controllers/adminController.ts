import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import Challenge from "../models/Challenge";
import Submission from "../models/Submission";
import User from "../models/User";
import asyncHandler from "../utils/asyncHandler";

/**
 * @desc    Get high-level platform statistics
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
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

/**
 * @desc    Get a list of all users on the platform
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
export const getAllUsers = asyncHandler(
  async (_: AuthenticatedRequest, res: Response) => {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json(users);
  }
);

/**
 * @desc    Get a list of all submissions on the platform
 * @route   GET /api/admin/submissions
 * @access  Private (Admin)
 */
export const getAllSubmissions = asyncHandler(
  async (_: AuthenticatedRequest, res: Response) => {
    const submissions = await Submission.find({})
      .populate("developerId", "profile.firstName email")
      .populate("challengeId", "title")
      .sort({ createdAt: -1 });
    res.status(200).json(submissions);
  }
);

/**
 * @desc    Update a user's details by their ID
 * @route   PATCH /api/admin/users/:userId
 * @access  Private (Admin)
 */
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

/**
 * @desc    Delete a challenge by its ID
 * @route   DELETE /api/admin/challenges/:challengeId
 * @access  Private (Admin)
 */
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
