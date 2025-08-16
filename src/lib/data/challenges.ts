import dbConnect from "@/lib/dbConnect";
import Challenge from "@/models/Challenge";
import { IChallenge } from "@/types";
import { unstable_noStore as noStore } from "next/cache";
import "server-only";
import { getSession } from "../auth";

import "@/models/User"; // Eagerly import the User model to register it with Mongoose

export const getAllChallenges = async (): Promise<IChallenge[]> => {
  noStore(); // Opts out of static rendering, ensures data is fresh
  try {
    await dbConnect();

    const challenges = await Challenge.find({ status: "published" })
      .populate(
        "createdBy",
        "profile.firstName profile.companyName profile.avatar"
      )
      .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(challenges));
  } catch (error) {
    console.error("Database Error: Failed to fetch all challenges.", error);
    throw new Error("Could not fetch challenges.");
  }
};

export const getChallengeById = async (
  id: string
): Promise<IChallenge | null> => {
  noStore();
  try {
    await dbConnect();
    const challenge = await Challenge.findById(id)
      .populate("createdBy", "profile.firstName profile.companyName")
      .lean();
    return challenge ? JSON.parse(JSON.stringify(challenge)) : null;
  } catch (error) {
    console.error(
      `Database Error: Failed to fetch challenge by ID: ${id}`,
      error
    );
    throw new Error("Could not fetch challenge.");
  }
};

export const getMyChallenges = async (): Promise<IChallenge[]> => {
  noStore();
  try {
    const session = await getSession();
    if (!session?.user) {
      throw new Error("Authentication required.");
    }

    await dbConnect();
    const challenges = await Challenge.find({
      createdBy: session.user._id,
    }).sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(challenges));
  } catch (error) {
    console.error("Database Error: Failed to fetch user's challenges.", error);
    throw new Error("Could not fetch your challenges.");
  }
};
