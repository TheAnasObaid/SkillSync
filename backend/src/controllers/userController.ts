import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import User from "../models/User";

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
