import { Router } from "express";
import {
  getPublicSubmissionsByChallenge,
  getSubmissionsByChallenge,
  getSubmissionsByDeveloper,
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

export default router;
