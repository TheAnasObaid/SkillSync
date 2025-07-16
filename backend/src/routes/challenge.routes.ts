import express from "express";
import { createChallenge } from "../controllers/challenge.controller";
import { authenticate } from "../middleware/authenticate.middleware";
import { authorize } from "../middleware/authorize.middleware";

const router = express.Router();

router.post("/", authenticate, authorize("client"), createChallenge);

export default router;
