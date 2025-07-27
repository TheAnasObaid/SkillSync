  import { Response } from "express";
  import { AuthenticatedRequest } from "../middleware/auth";

  import Challenge from "../models/Challenge";

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
      console.log("Challenge controller");
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
