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

const challengesRouter = express.Router();

// --- Static routes first ---

// GET challenges created by the logged-in client ("me")
challengesRouter.get("/me", authenticate, authorize("client"), getMyChallenges);

// GET all public challenges (root)
challengesRouter.get("/", getAllChallenges);

// POST to create a new challenge (root)
// Note: We need a validate middleware for the body, which we'll add back.
challengesRouter.post("/", authenticate, authorize("client"), createChallenge);

// --- Dynamic routes last ---

// GET a single challenge by its ID
challengesRouter.get("/:id", getChallengeById);

// PUT to update a challenge owned by the client
challengesRouter.put(
  "/:id",
  authenticate,
  authorize("client"),
  updateMyChallenge
);
// Note: I've simplified this from "/:id/me" to just "/:id" with a PUT method, which is more RESTful.
// The controller logic already checks for ownership.

// DELETE to remove a challenge owned by the client
challengesRouter.delete(
  "/:id",
  authenticate,
  authorize("client"),
  deleteMyChallenge
);

export default challengesRouter;
