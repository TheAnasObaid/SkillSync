import { Request, Response } from "express";
import User from "../models/user.model";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await User.create({ name, email, password, role });
    console.log("User", user);
    const newUser = await user.save();
    console.log("New User", newUser);
    res.status(201).json({ status: "success", user: newUser });
  } catch (err) {
    console.error(err);
  }
};
