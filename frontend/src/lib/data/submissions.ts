import dbConnect from "@/lib/dbConnect";
import { ISubmission } from "@/types";
import { unstable_noStore as noStore } from "next/cache";
import "server-only";
import { getSession } from "../auth";
import Challenge from "@/models/Challenge";
import Submission from "@/models/Submission";

export const getMySubmissions = async (): Promise<ISubmission[]> => {
  noStore();
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Authentication required.");

    await dbConnect();
    const submissions = await Submission.find({ developerId: session.user._id })
      .populate("challengeId", "title status prize")
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(submissions));
  } catch (error) {
    console.error("Database Error: Failed to fetch user's submissions.", error);
    throw new Error("Could not fetch your submissions.");
  }
};

export const getSubmissionsForReview = async (
  challengeId: string
): Promise<ISubmission[]> => {
  noStore();
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Authentication required.");

    await dbConnect();
    const challenge = await Challenge.findById(challengeId).select("createdBy");
    if (!challenge || challenge.createdBy.toString() !== session.user._id) {
      throw new Error(
        "Forbidden: You are not authorized to view these submissions."
      );
    }

    const submissions = await Submission.find({ challengeId })
      .populate("developerId", "profile.firstName email profile.avatar")
      .lean();
    return JSON.parse(JSON.stringify(submissions));
  } catch (error) {
    console.error(
      `Database Error: Failed to fetch submissions for review for challenge ${challengeId}.`,
      error
    );
    throw new Error("Could not fetch submissions for review.");
  }
};

export const getSubmissionDetails = async (
  submissionId: string
): Promise<ISubmission | null> => {
  noStore();
  try {
    await dbConnect();
    const submission = await Submission.findById(submissionId)
      .populate({
        path: "developerId",
        model: "User",
        select: "profile email",
      })
      .populate({
        path: "challengeId",
        model: "Challenge",
        select: "title prize deadline",
      });

    return submission ? JSON.parse(JSON.stringify(submission)) : null;
  } catch (error) {
    console.error(
      `Database Error: Failed to fetch submission details for ${submissionId}.`,
      error
    );
    throw new Error("Could not fetch submission details.");
  }
};

export const getPublicSubmissionsForChallenge = async (
  challengeId: string
): Promise<ISubmission[]> => {
  noStore();
  try {
    await dbConnect();
    const submissions = await Submission.find({ challengeId })
      .populate("developerId", "profile.firstName profile.avatar")
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(submissions));
  } catch (error) {
    console.error("Database Error: Failed to fetch public submissions.", error);
    throw new Error("Could not fetch submissions.");
  }
};
