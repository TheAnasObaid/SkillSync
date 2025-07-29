import { Router } from "express";
import {
  getPublicSubmissionsByChallenge,
  getSubmissionsByChallenge,
  getSubmissionsByDeveloper,
  rateSubmission,
  selectWinner,
} from "../controllers/submissionController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.get(
  "/challenge/:challengeId",
  authenticate,
  authorize("client"),
  getSubmissionsByChallenge
);

router.get("/public/challenge/:challengeId", getPublicSubmissionsByChallenge);

router.get(
  "/my-submissions",
  authenticate,
  authorize("developer"),
  getSubmissionsByDeveloper
);

router.patch(
  "/:submissionId/winner",
  authenticate,
  authorize("client"),
  selectWinner
);

router.post(
  "/:submissionId/rate",
  authenticate,
  authorize("client"),
  rateSubmission
);

export default router;
