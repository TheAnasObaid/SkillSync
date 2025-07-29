import express from "express";
import {
  createChallenge,
  getAllChallenges,
  getChallengesByClient,
  getSingleChallenge,
  submitSolution,
} from "../controllers/challengeController";
import { authenticate, authorize } from "../middleware/auth";
import validate from "../middleware/validate";
import { challengeSchema } from "../utils/validationSchemas";

const challengesRouter = express.Router();

challengesRouter.get(
  "/my-challenges",
  authenticate,
  authorize("client"),
  getChallengesByClient
);
challengesRouter.get("/", getAllChallenges);
challengesRouter.get("/:id", getSingleChallenge);
challengesRouter.post(
  "/",
  authenticate,
  authorize("client"),
  validate(challengeSchema),
  createChallenge
);
challengesRouter.post(
  "/:id/submit",
  authenticate,
  authorize("developer"),
  submitSolution
);

export default challengesRouter;
