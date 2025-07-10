import { Request, Response } from "express";
import User from "../models/user.model";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await User.create({ name, email, password, role });
    await user.save();
    res.status(201).json({ status: "success", user });
  } catch (err) {
    console.error(err);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user)
    res.status(400).json({ status: "failed", error: "User not found" });

  const isMatch = await user?.comparePassword(password);
  if (!isMatch)
    res.status(400).json({ status: "failed", error: "Invalid credentials" });

  res.status(200).json({ status: "success", user });
};
