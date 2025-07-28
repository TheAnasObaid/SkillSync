import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { getPlatformStats } from "../controllers/adminController";

const router = Router();

router.get("/stats", authenticate, authorize("admin"), getPlatformStats);

export default router;
