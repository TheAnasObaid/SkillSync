import { Response, Request } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import Submission from "../models/Submission";
import Challenge from "../models/Challenge";
import mongoose from "mongoose";

export const submitSolution = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id: challengeId } = req.params;

    const { githubRepo, liveDemo, description } = req.body;

    if (!githubRepo || !description) {
      res
        .status(400)
        .json({ message: "GitHub repository and description are required." });
    }

    const submission = await Submission.create({
      challengeId,
      developerId: req.userId,
      githubRepo,
      liveDemo,
      description,
    });

    res.status(201).json(submission);
  } catch (error) {
    console.error("Failed to submit solution:", error);
    res.status(500).json({ message: "Failed to submit solution" });
  }
};

export const getSubmissionsByDeveloper = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const developerId = req.userId;

    const submissions = await Submission.find({ developerId })
      .populate("challengeId", "title status prize")
      .sort({ createdAt: -1 });

    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching developer submissions:", error);
    res.status(500).json({ message: "Failed to fetch developer submissions" });
  }
};

export const getPublicSubmissionsByChallenge = async (
  req: Request,
  res: Response
) => {
  try {
    const { challengeId } = req.params;
    const submissions = await Submission.find({ challengeId: challengeId })
      .select("developerId description githubRepo liveDemo createdAt")
      .populate("developerId", "profile.firstName");

    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching public submissions:", error);
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
};

export const getSubmissionsByChallenge = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
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
    }).populate("developerId", "profile.firstName email");

    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
};

export const selectWinner = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { submissionId } = req.params;
  const userId = req.userId;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
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
  } catch (error: any) {
    await session.abortTransaction();
    console.error("Winner selection failed:", error);
    res
      .status(400)
      .json({ message: error.message || "Failed to select winner." });
  } finally {
    session.endSession();
  }
};

export const rateSubmission = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { submissionId } = req.params;
  const { ratings, feedback } = req.body;
  const userId = req.userId;

  try {
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

    // Update the submission with the new data
    submission.ratings = ratings;
    submission.feedback = feedback;
    if (submission.status === "pending") {
      submission.status = "reviewed"; // Mark as reviewed
    }

    await submission.save();

    res.status(200).json(submission);
  } catch (error) {
    console.error("Failed to rate submission:", error);
    res.status(500).json({ message: "Failed to rate submission." });
  }
};
