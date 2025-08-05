// ===== File: backend\src\controllers\submissionController.ts =====
import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { AuthenticatedRequest } from "../middleware/auth";
import upload from "../middleware/upload";
import Challenge from "../models/Challenge";
import Submission from "../models/Submission";
import asyncHandler from "../utils/asyncHandler";
import User from "../models/User";
import { emitToRoom, emitToUser } from "..";

/**
 * @desc    Submit a solution to a specific challenge
 * @route   POST /api/submissions/challenge/:challengeId
 * @access  Private (Developer)
 */
export const submitToChallenge = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    upload(req, res, async (err) => {
      if (err) {
        res.status(400).json({ message: err.message });
        return;
      }

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const { challengeId } = req.params;
        const { githubRepo, liveDemo, description } = req.body;

        if (!githubRepo || !description) {
          throw new Error("GitHub repo and description are required.");
        }

        const challenge = await Challenge.findById(challengeId).session(
          session
        );
        if (!challenge) {
          throw new Error("Challenge not found.");
        }

        if (challenge.deadline < new Date()) {
          throw new Error("The deadline for this challenge has passed.");
        }

        const submissionData = {
          challengeId,
          developerId: req.userId,
          githubRepo,
          liveDemo,
          description,
          files: req.file
            ? [{ name: req.file.originalname, path: req.file.path }]
            : [],
        };

        const newSubmissionArray = await Submission.create([submissionData], {
          session,
        });
        const newSubmission = newSubmissionArray[0];

        const populatedSubmission = await Submission.findById(newSubmission._id)
          .populate({
            path: "developerId",
            select: "profile.firstName profile.avatar _id",
          })
          .session(session);

        // This emits the full submission object to everyone in the challenge room
        emitToRoom(
          challengeId,
          "new_submission_for_challenge",
          populatedSubmission
        );

        const challengeOwnerId = challenge.createdBy.toString();
        emitToUser(challengeOwnerId, "new_submission_notification", {
          message: `You have a new submission for your challenge: "${challenge.title}"`,
          challengeId: challenge._id,
        });

        challenge.submissions.push(newSubmission._id as Types.ObjectId);
        await challenge.save({ session });

        await session.commitTransaction();

        res.status(201).json(newSubmission);
      } catch (error: any) {
        await session.abortTransaction();
        console.error("Submission Error:", error);
        res.status(400).json({
          message:
            error.message ||
            "An internal server error occurred during submission.",
        });
      } finally {
        session.endSession();
      }
    });
  }
);

/**
 * @desc    Get all public submissions for a specific challenge
 * @route   GET /api/submissions/challenge/:challengeId
 * @access  Public
 */
export const getPublicSubmissionsForChallenge = asyncHandler(
  async (req: Request, res: Response) => {
    const { challengeId } = req.params;
    const submissions = await Submission.find({ challengeId: challengeId })
      // FIX: Added 'challengeId' to the select statement to ensure it's returned to the client.
      .select(
        "challengeId developerId description githubRepo liveDemo createdAt"
      )
      .populate("developerId", "profile.firstName profile.avatar");

    res.status(200).json(submissions);
  }
);

/**
 * @desc    Get all submissions for a challenge (for the client who owns it)
 * @route   GET /api/submissions/challenge/:challengeId/review
 * @access  Private (Client)
 */
export const getSubmissionsForChallenge = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { challengeId } = req.params;
    const userId = req.userId;

    const challenge = await Challenge.findById(challengeId);

    console.log("Hello");

    if (!challenge) {
      res.status(404).json({ message: "Challenge not found" });
      return;
    }

    if (challenge?.createdBy.toString() !== userId) {
      res
        .status(403)
        .json({ message: "Forbidden: You do not own this challenge" });
      return;
    }

    const submissions = await Submission.find({
      challengeId,
    }).populate("developerId", "profile.firstName email profile.avatar");
    console.log("Submissions", submissions);
    res.status(200).json(submissions);
    return;
  }
);

/**
 * @desc    Get all submissions made by the logged-in developer
 * @route   GET /api/submissions/me
 * @access  Private (Developer)
 */
export const getMySubmissions = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const challengeId = req.userId;
    const submissions = await Submission.find({ challengeId })
      .populate("challengeId", "title status prize")
      .sort({ createdAt: -1 });

    res.status(200).json(submissions);
  }
);

/**
 * @desc    Select a submission as the winner of a challenge
 * @route   PATCH /api/submissions/:submissionId/winner
 * @access  Private (Client)
 */
export const selectWinner = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
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

      if (!challenge.isFunded) {
        throw new Error(
          "Cannot select a winner. The challenge prize has not been funded."
        );
      }

      if (challenge.createdBy.toString() !== userId) {
        throw new Error("Forbidden: You do not own this challenge.");
      }

      if (challenge.status === "completed") {
        throw new Error(
          "A winner has already been selected for this challenge."
        );
      }

      winnerSubmission.status = "winner";
      challenge.status = "completed";

      const developer = await User.findById(
        winnerSubmission.developerId
      ).session(session);
      if (developer && developer.reputation) {
        developer.reputation.completedChallenges =
          (developer.reputation.completedChallenges || 0) + 1;
        developer.earnings = (developer.earnings || 0) + challenge.prize;

        await developer.save({ session });
      }

      await winnerSubmission.save({ session });
      await challenge.save({ session });

      await Submission.updateMany(
        { challengeId: challenge._id, _id: { $ne: submissionId } },
        { $set: { status: "rejected" } },
        { session }
      );

      // --- NEW NOTIFICATION LOGIC ---
      const developerId = winnerSubmission.developerId.toString();
      emitToUser(developerId, "challenge_winner", {
        message: `Congratulations! Your submission for "${challenge.title}" has been selected as the winner!`,
        challengeId: challenge._id,
      });
      // --- END ---

      await session.commitTransaction();
      res.status(200).json({ message: "Winner selected successfully." });
    } catch (error) {
      await session.abortTransaction();
      // The asyncHandler will catch this and send an appropriate response
      throw error;
    } finally {
      session.endSession();
    }
  }
);

/**
 * @desc    Rate a submission and provide feedback
 * @route   POST /api/submissions/:submissionId/rate
 * @access  Private (Client)
 */ export const rateSubmission = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { submissionId } = req.params;
    const { ratings, feedback } = req.body;
    const clientId = req.userId;

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      res.status(404).json({ message: "Submission not found." });
      return;
    }

    const challenge = await Challenge.findById(submission.challengeId);
    if (!challenge || challenge.createdBy.toString() !== clientId) {
      res.status(403).json({
        message:
          "You do not have permission to rate submissions for this challenge.",
      });
      return;
    }

    submission.ratings = ratings;
    submission.feedback = feedback;
    if (submission.status === "pending") {
      submission.status = "reviewed";
    }

    const developer = await User.findById(submission.developerId);
    if (developer && developer.reputation) {
      const oldTotalRatingPoints =
        (developer.reputation.rating || 0) *
        (developer.reputation.totalRatings || 0);
      const newTotalRatings = (developer.reputation.totalRatings || 0) + 1;
      const newAverageRating =
        (oldTotalRatingPoints + ratings.overall) / newTotalRatings;

      developer.reputation.rating = parseFloat(newAverageRating.toFixed(2));
      developer.reputation.totalRatings = newTotalRatings;

      await developer.save({ validateBeforeSave: false });
    }

    await submission.save();

    // --- NEW NOTIFICATION LOGIC ---
    emitToUser(submission.developerId.toString(), "submission_reviewed", {
      message: `Your submission for "${challenge.title}" has been reviewed.`,
      challengeId: challenge._id,
    });
    // --- END ---

    res.status(200).json(submission);
  }
);

// Add these to your existing submissionController.ts file

/**
 * @desc    Update a submission owned by the logged-in developer
 * @route   PUT /api/submissions/:id
 * @access  Private (Developer)
 */
export const updateMySubmission = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id: submissionId } = req.params;
    const developerId = req.userId;
    const { githubRepo, liveDemo, description } = req.body;

    const submission = await Submission.findOne({
      _id: submissionId,
      developerId,
    });

    if (!submission) {
      return res.status(404).json({
        message:
          "Submission not found or you do not have permission to edit it.",
      });
    }

    const challenge = await Challenge.findById(submission.challengeId);
    if (challenge && challenge.deadline < new Date()) {
      return res.status(400).json({
        message:
          "The deadline has passed; this submission can no longer be updated.",
      });
    }

    submission.githubRepo = githubRepo || submission.githubRepo;
    submission.liveDemo = liveDemo || submission.liveDemo;
    submission.description = description || submission.description;
    submission.updatedAt = new Date();

    const updatedSubmission = await submission.save();
    res.status(200).json(updatedSubmission);
  }
);

/**
 * @desc    Withdraw (delete) a submission owned by the logged-in developer
 * @route   DELETE /api/submissions/:id
 * @access  Private (Developer)
 */
export const withdrawMySubmission = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id: submissionId } = req.params;
    const developerId = req.userId;

    const submission = await Submission.findOne({
      _id: submissionId,
      developerId,
    });

    if (!submission) {
      return res.status(404).json({
        message:
          "Submission not found or you do not have permission to withdraw it.",
      });
    }

    const challenge = await Challenge.findById(submission.challengeId);
    if (challenge && challenge.deadline < new Date()) {
      return res.status(400).json({
        message:
          "The deadline has passed; this submission cannot be withdrawn.",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await submission.deleteOne({ session });

      await Challenge.updateOne(
        { _id: submission.challengeId },
        { $pull: { submissions: submissionId } },
        { session }
      );

      await session.commitTransaction();
      res.status(200).json({ message: "Submission withdrawn successfully." });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
);
export const getSubmissionDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const { submissionId } = req.params;
    const submission = await Submission.findById(submissionId)
      .populate({
        path: "developerId",
        select: "profile.firstName profile.lastName profile.avatar email",
      })
      .populate({
        path: "challengeId",
        select: "title prize deadline",
      });

    if (!submission) {
      return res.status(404).json({ message: "Submission not found." });
    }

    res.status(200).json(submission);
  }
);
