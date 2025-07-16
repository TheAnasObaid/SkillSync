import express from "express";
import {
  createChallenge,
  getAllChallenges,
} from "../controllers/challenge.controller";
import { authenticate } from "../middleware/authenticate.middleware";
import { authorize } from "../middleware/authorize.middleware";

const router = express.Router();

router.post("/", authenticate, authorize("client"), createChallenge);
router.get("/", authenticate, getAllChallenges);

export default router;
