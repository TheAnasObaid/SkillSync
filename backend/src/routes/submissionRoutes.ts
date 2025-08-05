import { Router } from "express";
import {
  getMySubmissions,
  getSubmissionsForChallenge,
  rateSubmission,
  selectWinner,
  submitToChallenge,
  updateMySubmission,
  withdrawMySubmission,
} from "../controllers/submissionController";
import { authenticate, authorize } from "../middleware/auth";

const submissionsRouter = Router();

// Routes for the LOGGED-IN developer
submissionsRouter.get(
  "/me",
  authenticate,
  authorize("developer"),
  getMySubmissions
);

// --- Routes related to a SPECIFIC CHALLENGE ---
// GET /api/submissions/challenge/:challengeId (Public submissions)
submissionsRouter.get("/challenge/:challengeId", getMySubmissions);

// POST /api/submissions/challenge/:challengeId (Submit a solution)
submissionsRouter.post(
  "/challenge/:challengeId",
  authenticate,
  authorize("developer"),
  submitToChallenge
);

// GET /api/submissions/challenge/:challengeId/review (Client's review view)
submissionsRouter.get(
  "/challenge/:challengeId/review",
  authenticate,
  authorize("client"),
  getSubmissionsForChallenge
);

// --- Routes for a SPECIFIC SUBMISSION ---
// PATCH /api/submissions/:submissionId/winner (Select a winner)
submissionsRouter.patch(
  "/:submissionId/winner",
  authenticate,
  authorize("client"),
  selectWinner
);

// POST /api/submissions/:submissionId/rate (Rate a submission)
submissionsRouter.post(
  "/:submissionId/rate",
  authenticate,
  authorize("client"),
  rateSubmission
);

// --- NEW DYNAMIC ROUTES FOR A SPECIFIC SUBMISSION ---

submissionsRouter.put(
  "/:id",
  authenticate,
  authorize("developer"),
  updateMySubmission
);
submissionsRouter.delete(
  "/:id",
  authenticate,
  authorize("developer"),
  withdrawMySubmission
);

export default submissionsRouter;
