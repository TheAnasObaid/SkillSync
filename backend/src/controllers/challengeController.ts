import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import upload from "../middleware/upload";
import Challenge from "../models/Challenge";
import Submission from "../models/Submission";
import asyncHandler from "../utils/asyncHandler";
import { ChallengeDto, challengeSchema } from "../utils/validationSchemas";

export const createChallenge = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    upload(req, res, async (err) => {
      // Handle any file upload errors first
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const parsedBody = challengeSchema.safeParse(req.body);

      if (!parsedBody.success) {
        // If validation fails, return the Zod error issues.
        res.status(400).json({ issues: parsedBody.error.issues });
        return;
      }

      const {
        title,
        description,
        prize,
        requirements,
        difficulty,
        deadline,
        tags,
        category,
      }: ChallengeDto = parsedBody.data;

      const newChallenge = new Challenge({
        title,
        description,
        prize,
        requirements,
        difficulty,
        category,
        deadline,
        tags: tags ? tags.split(",").map((tag: string) => tag.trim()) : [],
        createdBy: req.userId,
        status: "published",
        // 2. If a file was uploaded, add it to the 'files' array
        files: req.file
          ? [{ name: req.file.originalname, path: req.file.path }]
          : [],
      });

      await newChallenge.save();
      res.status(201).json(newChallenge);
    });
  }
);

export const getMyChallenges = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const allChallenges = await Challenge.find({ createdBy: req.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(allChallenges);
  }
);

export const getChallengeById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const challenge = await Challenge.findById(req.params.id).populate(
      "createdBy",
      "profile.firstName profile.companyName"
    );
    if (!challenge) {
      res.status(404).json({ message: "Challenge not found" });
      return;
    }
    res.status(200).json(challenge);
  }
);

export const getAllChallenges = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const allChallenges = await Challenge.find();
    res.status(200).json(allChallenges);
  }
);

export const updateMyChallenge = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const challenge = await Challenge.findOne({
      _id: req.params.id,
      createdBy: req.userId,
    });
    if (!challenge) {
      res
        .status(404)
        .json({ message: "Challenge not found or you are not the owner." });
      return;
    }

    const parsedBody = challengeSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ issues: parsedBody.error.issues });
      return;
    }

    // Update the challenge object with new values
    Object.assign(challenge, parsedBody.data);

    const updatedChallenge = await challenge.save();
    res.status(200).json(updatedChallenge);
  }
);

export const deleteMyChallenge = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const challenge = await Challenge.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.userId,
    });
    if (!challenge) {
      res
        .status(404)
        .json({ message: "Challenge not found or you are not the owner." });
      return;
    }

    await Submission.deleteMany({ challengeId: req.params.id });
    res.status(200).json({ message: "Challenge deleted successfully." });
  }
);
