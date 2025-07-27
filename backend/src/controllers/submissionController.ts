import { Response, Request } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import Submission from "../models/Submission";

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
  req: Request,
  res: Response
) => {
  const { challengeId } = req.params;

  const submissions = await Submission.find({
    challengeId,
  }).populate("developerId", "profile.firstName email");

  console.log("Submissions server", submissions);

  res.json(submissions);
};
