import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";

import Challenge from "../models/Challenge";
import Submission from "../models/Submission";
import upload from "../middleware/upload";

export const createChallenge = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const {
      title,
      description,
      prize,
      requirements,
      category,
      difficulty,
      deadline,
      tags,
    } = req.body;

    if (
      !title ||
      !description ||
      !prize ||
      !requirements ||
      !difficulty ||
      !deadline
    ) {
      res.status(400).json({ message: "Please provide all required fields." });
    }

    const challenge = await Challenge.create({
      title,
      description,
      prize,
      requirements,
      category,
      difficulty,
      deadline,
      tags: tags ? tags.split(",").map((tag: string) => tag.trim()) : [],
      createdBy: req.userId,
      status: "published",
    });

    res.status(201).json(challenge);
  } catch (error) {
    console.error("Error creating challenge:", error);
    res.status(500).json({ message: "Failed to create challenge" });
  }
};

export const getChallengesByClient = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const allChallenges = await Challenge.find({ createdBy: req.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(allChallenges);
  } catch (error) {
    console.error("ERROR FETCHING CLIENT CHALLENGES:", error);
    res.status(500).json({ message: "Failed to fetch client challenges" });
  }
};

export const getAllChallenges = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const allChallenges = await Challenge.find();
    res.status(200).json(allChallenges);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch challenges" });
  }
};

export const getSingleChallenge = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const challenege = await Challenge.findById(req.params.id);
    res.status(200).json(challenege);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch challenges" });
  }
};

export const submitSolution = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  // 1. Call the upload middleware first.
  // The rest of our logic will run inside its callback.
  upload(req, res, async (err) => {
    // Handle any upload-specific errors first
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    // Now, inside this callback, Multer has finished its job.
    // req.body and req.file are guaranteed to be populated.
    try {
      const { id: challengeId } = req.params;
      // 2. We can now safely destructure req.body.
      const { githubRepo, liveDemo, description } = req.body;

      if (!githubRepo || !description) {
        return res
          .status(400)
          .json({ message: "GitHub repository and description are required." });
      }

      const submissionData = {
        challengeId: challengeId,
        developerId: req.userId,
        githubRepo,
        liveDemo,
        description,
        files: [] as { name: string; path: string }[],
      };

      if (req.file) {
        submissionData.files.push({
          name: req.file.originalname,
          path: req.file.path,
        });
      }

      const submission = await Submission.create(submissionData);

      res.status(201).json(submission);
    } catch (error) {
      console.error("Failed to submit solution:", error);
      res.status(500).json({ message: "Failed to submit solution" });
    }
  });
};
