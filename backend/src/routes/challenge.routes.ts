import express from "express";
import {
  createChallenge,
  getAllChallenges,
  getSingleChallenge,
} from "../controllers/challenge.controller";
import { submitSolution } from "../controllers/submission.controller";
import { authenticate } from "../middleware/authenticate.middleware";
import { authorize } from "../middleware/authorize.middleware";

const router = express.Router();

router.post("/", authenticate, authorize("client"), createChallenge);
router.get("/", getAllChallenges);
router.get("/:id", getSingleChallenge);
router.post(
  "/:id/submit",
  authenticate,
  authorize("developer"),
  submitSolution
);

export default router;
