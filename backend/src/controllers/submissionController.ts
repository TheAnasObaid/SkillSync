import { Request, Response } from "express";
import mongoose from "mongoose";
import { AuthenticatedRequest } from "../middleware/auth";
import upload from "../middleware/upload";
import Challenge from "../models/Challenge";
import Submission from "../models/Submission";
import asyncHandler from "../utils/asyncHandler";

export const submitSolution = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const { id: challengeId } = req.params;
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
    });
  }
);

export const getMySubmissions = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const developerId = req.userId;
    const submissions = await Submission.find({ developerId })
      .populate("challengeId", "title status prize")
      .sort({ createdAt: -1 });
    res.status(200).json(submissions);
  }
);

export const getPublicSubmissions = asyncHandler(
  async (req: Request, res: Response) => {
    const { challengeId } = req.params;
    const submissions = await Submission.find({ challengeId: challengeId })
      .select("developerId description githubRepo liveDemo createdAt")
      .populate("developerId", "profile.firstName profile.avatar");

    res.status(200).json(submissions);
  }
);

export const getSubmissionsForChallenge = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { challengeId } = req.params;
    const userId = req.userId;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      res.status(404).json({ message: "Challenge not found" });
    }
    if (challenge?.createdBy.toString() !== userId) {
      res
        .status(403)
        .json({ message: "Forbidden: You do not own this challenge" });
    }

    const submissions = await Submission.find({
      challengeId,
    }).populate("developerId", "profile.firstName email profile.avatar");
    res.status(200).json(submissions);
  }
);

export const selectWinner = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { submissionId } = req.params;
    const userId = req.userId;

    const session = await mongoose.startSession();
    session.startTransaction();

    const winnerSubmission = await Submission.findById(submissionId).session(
      session
    );
    if (!winnerSubmission) {
      throw new Error("Submission not found.");
    }

    const challenge = await Challenge.findById(
      winnerSubmission.challengeId
    ).session(session);
    if (!challenge) {
      throw new Error("Challenge not found.");
    }

    if (challenge.createdBy.toString() !== userId) {
      throw new Error("Forbidden: You do not own this challenge.");
    }

    if (challenge.status === "completed") {
      throw new Error("A winner has already been selected for this challenge.");
    }

    winnerSubmission.status = "winner";
    challenge.status = "completed";

    await winnerSubmission.save({ session });
    await challenge.save({ session });

    await Submission.updateMany(
      { challengeId: challenge._id, _id: { $ne: submissionId } },
      { $set: { status: "rejected" } },
      { session }
    );

    await session.commitTransaction();
    res.status(200).json({ message: "Winner selected successfully." });
  }
);

export const rateSubmission = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { submissionId } = req.params;
    const { ratings, feedback } = req.body;
    const userId = req.userId;

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      res.status(404).json({ message: "Submission not found." });
      return;
    }

    const challenge = await Challenge.findById(submission.challengeId);
    if (challenge?.createdBy.toString() !== userId) {
      res.status(403).json({ message: "You do not own this challenge." });
      return;
    }

    submission.ratings = ratings;
    submission.feedback = feedback;

    if (submission.status === "pending") {
      submission.status = "reviewed";
    }

    await submission.save();
    res.status(200).json(submission);
  }
);
