import { Request, Response } from "express";
import User from "../models/User";
import generateToken from "../utils/generateToken";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await User.create({
      "profile.firstName": name,
      email,
      password,
      role,
    });
    await user.save();

    res.status(201).json({
      status: "success",
      user: {
        id: user?.id,
        name: user?.profile?.firstName,
        email: user?.email,
        role: user?.role,
      },
      token: generateToken(user.id),
    });
  } catch (err) {
    console.error(err);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(400).json({ status: "failed", error: "User not found" });
    return;
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    res.status(400).json({ status: "failed", error: "Invalid credentials" });
    return;
  }

  // --- START OF CHANGE ---

  // Instead of creating a simplified object like { name: user.profile.firstName, ... }
  // Send the entire user object, which already has the correct structure.
  // We can manually remove the password to be safe, although .select('-password') on a new query would also work.
  const userPayload = user.toObject();
  console.log(userPayload);

  res.status(200).json({
    status: "success",
    user: userPayload, // Send the correctly structured user object
    token: generateToken(user.id),
  });
};
