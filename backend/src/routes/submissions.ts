import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import {
  getSubmissionsByChallenge,
  selectWinner,
} from "../controllers/submissionController";

const router = Router();

router.get(
  "/challenge/:challengeId",
  authenticate,
  authorize("client"),
  getSubmissionsByChallenge
);

router.patch(
  "/:submissionId/winner",
  authenticate,
  authorize("client"),
  selectWinner
);

export default router;
