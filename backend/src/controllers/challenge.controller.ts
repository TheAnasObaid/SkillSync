import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authenticate.middleware";
import Challenge from "../models/challenge.model";

export const createChallenge = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { title, description, prize } = req.body;

    const challenge = await Challenge.create({
      title,
      description,
      prize,
      createdBy: req.userId,
    });

    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ message: "Failed to create challenge" });
  }
};
