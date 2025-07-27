import { Response, Request } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import Submission from "../models/Submission";
import Challenge from "../models/Challenge";

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
