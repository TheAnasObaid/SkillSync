import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import upload from "../middleware/upload";
import Challenge from "../models/Challenge";
import Submission from "../models/Submission";
import asyncHandler from "../utils/asyncHandler";
import { ChallengeDto, challengeSchema } from "../utils/validationSchemas";

/**
 * @desc    Create a new challenge
 * @route   POST /api/challenges
 * @access  Private (Client)
 */
export const createChallenge = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const parsedBody = challengeSchema.safeParse(req.body);

      if (!parsedBody.success) {
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
        files: req.file
          ? [{ name: req.file.originalname, path: req.file.path }]
          : [],
      });

      await newChallenge.save();
      res.status(201).json(newChallenge);
    });
  }
);

/**
 * @desc    Get a list of all public, published challenges
 * @route   GET /api/challenges
 * @access  Public
 */
export const getAllChallenges = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const allChallenges = await Challenge.find();
    res.status(200).json(allChallenges);
  }
);

/**
 * @desc    Get a single challenge by its ID
 * @route   GET /api/challenges/:id
 * @access  Public
 */
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

/**
 * @desc    Get challenges created by the logged-in client
 * @route   GET /api/challenges/me
 * @access  Private (Client)
 */
export const getMyChallenges = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const allChallenges = await Challenge.find({ createdBy: req.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(allChallenges);
  }
);

/**
 * @desc    Update a challenge owned by the logged-in client
 * @route   PUT /api/challenges/:id
 * @access  Private (Client)
 */
export const updateMyChallenge = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id: challengeId } = req.params;
    const clientId = req.userId;

    // We can reuse our Zod schema for validation
    const parsedBody = challengeSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ issues: parsedBody.error.issues });
      return;
    }

    const challenge = await Challenge.findOneAndUpdate(
      { _id: challengeId, createdBy: clientId }, // Condition: Find the challenge AND ensure ownership
      { $set: parsedBody.data }, // Update with the validated data
      { new: true, runValidators: true } // Options: return the new document and run schema validators
    );

    if (!challenge) {
      res
        .status(404)
        .json({ message: "Challenge not found or you are not the owner." });
      return;
    }

    res.status(200).json(challenge);
  }
);

/**
 * @desc    Delete a challenge owned by the logged-in client
 * @route   DELETE /api/challenges/:id
 * @access  Private (Client)
 */
export const deleteMyChallenge = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id: challengeId } = req.params;
    const clientId = req.userId;

    const challenge = await Challenge.findOneAndDelete({
      _id: challengeId,
      createdBy: clientId,
    });

    if (!challenge) {
      res
        .status(404)
        .json({ message: "Challenge not found or you are not the owner." });
      return;
    }

    // Optional but highly recommended: Delete all submissions associated with this challenge
    await Submission.deleteMany({ challengeId: challengeId });

    res.status(200).json({
      message: "Challenge and all associated submissions have been deleted.",
    });
  }
);
