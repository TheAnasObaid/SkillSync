import express from "express";
import {
  createChallenge,
  deleteMyChallenge,
  getAllChallenges,
  getChallengeById,
  getMyChallenges,
  updateMyChallenge,
} from "../controllers/challengeController";
import { authenticate, authorize } from "../middleware/auth";
import validate from "../middleware/validate";
import { challengeSchema } from "../utils/validationSchemas";

const challengesRouter = express.Router();

// GET all public challenges
challengesRouter.get("/", getAllChallenges);

// GET a single challenge by its ID
challengesRouter.get("/:id", getChallengeById);

// Routes for the logged-in client
challengesRouter.post(
  "/",
  authenticate,
  authorize("client"),
  validate(challengeSchema),
  createChallenge
);
challengesRouter.get("/me", authenticate, authorize("client"), getMyChallenges);
challengesRouter.put(
  "/:id/me",
  authenticate,
  authorize("client"),
  updateMyChallenge
);

// For updating a challenge they own
challengesRouter.delete(
  "/:id/me",
  authenticate,
  authorize("client"),
  deleteMyChallenge
); // For deleting a challenge they own

// REMOVED: POST /:id/submit -> This now belongs in submissions.ts

export default challengesRouter;
