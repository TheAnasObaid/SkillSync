import express from "express";
import {
  createChallenge,
  getAllChallenges,
  getSingleChallenge,
} from "../controllers/challengeController";
import { submitSolution } from "../controllers/submissionController";
import { authenticate, authorize } from "../middleware/auth";

const challengesRouter = express.Router();

challengesRouter.post("/", authenticate, authorize("client"), createChallenge);
challengesRouter.get("/", getAllChallenges);
challengesRouter.get("/:id", getSingleChallenge);
challengesRouter.post(
  "/:id/submit",
  authenticate,
  authorize("developer"),
  submitSolution
);

export default challengesRouter;
