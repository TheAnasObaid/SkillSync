import { Response, Request } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import Submission from "../models/Submission";

export const submitSolution = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { content } = req.body;
    const challengeId = req.params.id;

    const submission = await Submission.create({
      challengeId,
      developerId: req.userId,
      content,
    });

    res.status(201).json(submission);
  } catch {
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
