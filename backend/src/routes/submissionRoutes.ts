// ===== File: backend\src\routes\submissionRoutes.ts =====
import express from "express";
import {
  submitToChallenge,
  getPublicSubmissionsForChallenge,
  getSubmissionsForChallenge,
  getMySubmissions,
  selectWinner,
  rateSubmission,
  updateMySubmission,
  withdrawMySubmission,
  getSubmissionDetails,
} from "../controllers/submissionController";
import { authenticate, authorize } from "../middleware/auth";

const router = express.Router();

// --- ORDER MATTERS: MOST SPECIFIC ROUTES FIRST ---

// Static private route
router.route("/me").get(authenticate, authorize("developer"), getMySubmissions);

// Specific parameterized public route for details
router.route("/:submissionId/details").get(getSubmissionDetails);

// Specific parameterized private routes for actions
router
  .route("/:submissionId/winner")
  .patch(authenticate, authorize("client"), selectWinner);
router
  .route("/:submissionId/rate")
  .post(authenticate, authorize("client"), rateSubmission);

// --- CHALLENGE-SPECIFIC ROUTES ---
// These are also specific and grouped. The /review route must come first.
router
  .route("/challenge/:challengeId/review")
  .get(authenticate, authorize("client"), getSubmissionsForChallenge);

router
  .route("/challenge/:challengeId")
  .get(getPublicSubmissionsForChallenge)
  .post(authenticate, authorize("developer"), submitToChallenge);

// --- GENERIC PARAMETERIZED ROUTE LAST ---
// This will only match if none of the more specific routes above did.
router
  .route("/:id")
  .put(authenticate, authorize("developer"), updateMySubmission)
  .delete(authenticate, authorize("developer"), withdrawMySubmission);

export default router;
