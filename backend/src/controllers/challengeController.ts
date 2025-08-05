// ===== File: backend\src\controllers\challengeController.ts =====
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import upload from "../middleware/upload";
import Challenge from "../models/Challenge";
import Submission from "../models/Submission";
import asyncHandler from "../utils/asyncHandler";
import { ChallengeDto, challengeSchema } from "../utils/validationSchemas";

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

export const getAllChallenges = asyncHandler(
  async (req: Request, res: Response) => {
    // FIX: Removed the { status: "published" } filter to ensure all challenges are fetched.
    // This prevents an empty page if challenges are in a different state (e.g., draft).
    const allChallenges = await Challenge.find({}).populate(
      "createdBy",
      "profile.firstName profile.companyName profile.avatar"
    );
    res.status(200).json(allChallenges);
  }
);

export const getChallengeById = asyncHandler(
  async (req: Request, res: Response) => {
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

export const getMyChallenges = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const allChallenges = await Challenge.find({ createdBy: req.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(allChallenges);
  }
);

export const updateMyChallenge = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    // FIX: Wrap the entire function logic in the 'upload' middleware
    // to correctly parse multipart/form-data, just like in createChallenge.
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const { id: challengeId } = req.params;
      const clientId = req.userId;

      // Zod validation will now work because multer has populated req.body
      const parsedBody = challengeSchema.safeParse(req.body);
      if (!parsedBody.success) {
        res.status(400).json({ issues: parsedBody.error.issues });
        return;
      }

      // Create the base payload with validated text fields
      const updatePayload: any = { ...parsedBody.data };

      // If a new file was uploaded, add it to the payload.
      // This will replace the existing file.
      if (req.file) {
        updatePayload.files = [
          { name: req.file.originalname, path: req.file.path },
        ];
      }

      const challenge = await Challenge.findOneAndUpdate(
        { _id: challengeId, createdBy: clientId },
        { $set: updatePayload },
        { new: true, runValidators: true }
      );

      if (!challenge) {
        res
          .status(404)
          .json({ message: "Challenge not found or you are not the owner." });
        return;
      }

      res.status(200).json(challenge);
    });
  }
);

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

    await Submission.deleteMany({ challengeId: challengeId });

    res.status(200).json({
      message: "Challenge and all associated submissions have been deleted.",
    });
  }
);

export const fundChallenge = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const challenge = await Challenge.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.userId },
      { isFunded: true },
      { new: true, runValidators: true }
    );

    if (!challenge) {
      return res
        .status(404)
        .json({ message: "Challenge not found or you are not the owner." });
    }

    res
      .status(200)
      .json({ message: "Challenge successfully funded.", challenge });
  }
);
