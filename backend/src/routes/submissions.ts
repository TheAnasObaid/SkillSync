import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { getSubmissionsByChallenge } from "../controllers/submissionController";

const router = Router();

router.get(
  "/challenge/:challengeId",
  authenticate, 
  authorize("client"),
  getSubmissionsByChallenge
);

export default router;
