import { Request, Response } from "express";
import User from "../models/User";
import generateToken from "../utils/generateToken";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await User.create({ name, email, password, role });
    await user.save();

    res.status(201).json({
      status: "success",
      user: {
        id: user?.id,
        name: user?.name,
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

  if (!user)
    res.status(400).json({ status: "failed", error: "User not found" });

  const isMatch = await user?.comparePassword(password);

  if (!isMatch)
    res.status(400).json({ status: "failed", error: "Invalid credentials" });

  res.status(200).json({
    status: "success",
    user: {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
    },
    token: generateToken(user?.id.toString()),
  });
};
