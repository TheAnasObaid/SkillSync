import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import upload, { uploadPortfolioImage } from "../middleware/upload";
import Challenge from "../models/Challenge";
import Submission from "../models/Submission";
import User from "../models/User";
import { PortfolioItem } from "../types";
import asyncHandler from "../utils/asyncHandler";

export const getMe = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  }
);

export const updateMyProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId;
    const { profile, email, name } = req.body;

    const updateData = {
      ...(email && { email }),
      "profile.firstName": name,
      "profile.lastName": profile?.lastName,
      "profile.companyName": profile?.companyName,
      "profile.bio": profile?.bio,
      "profile.skills": profile?.skills,
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(updatedUser);
  }
);

export const addMyPortfolioItem = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    uploadPortfolioImage(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res
          .status(400)
          .json({ message: "A project image is required." });
      }

      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const { title, description, liveUrl, githubUrl } = req.body;
      if (!title || !description) {
        return res
          .status(400)
          .json({ message: "Title and description are required." });
      }

      const newItem: PortfolioItem = {
        title,
        description,
        imageUrl: req.file.path,
        liveUrl,
        githubUrl,
      };
      user.profile?.portfolio.push(newItem);

      await user.save();
      res.status(201).json(user.profile?.portfolio);
    });
  }
);

export const deleteMyPortfolioItem = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { itemId } = req.params;
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const itemIndex = user.profile?.portfolio.findIndex(
      (p) => p._id?.toString() === itemId
    );

    if (itemIndex === -1 || itemIndex === undefined) {
      res.status(404).json({ message: "Portfolio item not found." });
      return;
    }

    user.profile?.portfolio.splice(itemIndex, 1);

    await user.save();

    res.status(200).json({ message: "Portfolio item deleted successfully." });
  }
);

export const uploadMyAvatar = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      if (req.file == undefined) {
        return res.status(400).json({ message: "Error: No File Selected!" });
      }

      const user = await User.findById(req.userId);
      if (!user || !user.profile) {
        return res.status(404).json({ message: "User not found" });
      }

      user.profile.avatar = req.file.path;
      await user.save();

      res.status(200).json({
        message: "Avatar uploaded successfully!",
        avatarUrl: req.file.path,
      });
    });
  }
);

export const getMyDeveloperStats = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const developerId = req.userId;
    const totalSubmissions = await Submission.countDocuments({ developerId });
    const winningSubmissions = await Submission.countDocuments({
      developerId,
      status: "winner",
    });
    const pendingReviews = await Submission.countDocuments({
      developerId,
      status: "pending",
    });

    // In a real app, you might also calculate earnings from challenge prizes
    // const totalEarnings = await ...

    res.status(200).json({
      totalSubmissions,
      winningSubmissions,
      pendingReviews,
    });
  }
);

export const getMyClientStats = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const clientId = req.userId;

    const totalChallengesPosted = await Challenge.countDocuments({
      createdBy: clientId,
    });

    const activeChallenges = await Challenge.countDocuments({
      createdBy: clientId,
      status: "active", // or 'published' if that's your active state
    });

    const clientChallenges = await Challenge.find({
      createdBy: clientId,
    }).select("_id");

    const challengeIds = clientChallenges.map((c) => c._id);

    const totalSubmissionsReceived = await Submission.countDocuments({
      challengeId: { $in: challengeIds },
    });

    res.status(200).json({
      totalChallengesPosted,
      activeChallenges,
      totalSubmissionsReceived,
    });
  }
);

/**
 * @desc    Get a user's public profile by their ID
 * @route   GET /api/users/:id
 * @access  Public
 */
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  // We only select fields that are safe for public display.
  // We explicitly EXCLUDE sensitive info like email.
  const user = await User.findById(req.params.id).select(
    "profile reputation role"
  );

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  // We can also decide to only return profiles for developers
  if (user.role !== "developer") {
    res.status(404).json({ message: "This user profile is not public." });
    return;
  }

  res.status(200).json(user);
});
