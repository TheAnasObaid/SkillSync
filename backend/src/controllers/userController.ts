import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import User, { PortfolioItem } from "../models/User";
import upload from "../middleware/upload";
import Submission from "../models/Submission";
import Challenge from "../models/Challenge";

export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

export const updateUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
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
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Failed to update user profile" });
  }
};

export const addPortfolioItem = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const { title, description, imageUrl, liveUrl, githubUrl } = req.body;
    if (!title || !description || !imageUrl) {
      res
        .status(400)
        .json({ message: "Title, description, and image URL are required." });
      return;
    }

    const newItem: PortfolioItem = {
      title,
      description,
      imageUrl,
      liveUrl,
      githubUrl,
    };

    user.profile?.portfolio.push(newItem);
    await user.save();

    res.status(201).json(user.profile?.portfolio);
  } catch (error) {
    res.status(500).json({ message: "Failed to add portfolio item." });
  }
};

export const deletePortfolioItem = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Pull the item from the portfolio array
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
  } catch (error) {
    res.status(500).json({ message: "Failed to delete portfolio item." });
  }
};

export const uploadAvatar = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (req.file == undefined) {
      return res.status(400).json({ message: "Error: No File Selected!" });
    }

    try {
      const user = await User.findById(req.userId);
      if (!user || !user.profile) {
        return res.status(404).json({ message: "User not found" });
      }

      // Save the file path to the user's profile
      user.profile.avatar = req.file.path;
      await user.save();

      res.status(200).json({
        message: "Avatar uploaded successfully!",
        avatarUrl: req.file.path,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error while updating profile." });
    }
  });
};

export const getDeveloperStats = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch developer stats" });
  }
};

export const getClientStats = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const clientId = req.userId;

    const totalChallengesPosted = await Challenge.countDocuments({
      createdBy: clientId,
    });

    const activeChallenges = await Challenge.countDocuments({
      createdBy: clientId,
      status: "active", // or 'published' if that's your active state
    });

    // This is a more complex query: we need to find all challenges by this client,
    // then count the total submissions for those challenges.
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
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch client stats" });
  }
};
