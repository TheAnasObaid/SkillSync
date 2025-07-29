import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import User, { PortfolioItem } from "../models/User";

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

    // You would typically get the imageUrl from a file upload service.
    // For now, we'll assume it's sent in the body.
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

// 2. DELETE A PORTFOLIO ITEM
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
