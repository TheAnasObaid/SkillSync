import { Router } from "express";
import {
  getMySubmissions,
  getPublicSubmissions,
  getSubmissionsForChallenge,
  rateSubmission,
  selectWinner,
  submitToChallenge,
} from "../controllers/submissionController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

// Routes for the LOGGED-IN developer
router.get("/me", authenticate, authorize("developer"), getMySubmissions);

// --- Routes related to a SPECIFIC CHALLENGE ---
// GET /api/submissions/challenge/:challengeId (Public submissions)
router.get("/challenge/:challengeId", getPublicSubmissions);

// POST /api/submissions/challenge/:challengeId (Submit a solution)
router.post(
  "/challenge/:challengeId",
  authenticate,
  authorize("developer"),
  submitToChallenge
);

// GET /api/submissions/challenge/:challengeId/review (Client's review view)
router.get(
  "/challenge/:challengeId/review",
  authenticate,
  authorize("client"),
  getSubmissionsForChallenge
);

// --- Routes for a SPECIFIC SUBMISSION ---
// PATCH /api/submissions/:submissionId/winner (Select a winner)
router.patch(
  "/:submissionId/winner",
  authenticate,
  authorize("client"),
  selectWinner
);

// POST /api/submissions/:submissionId/rate (Rate a submission)
router.post(
  "/:submissionId/rate",
  authenticate,
  authorize("client"),
  rateSubmission
);

export default router;
