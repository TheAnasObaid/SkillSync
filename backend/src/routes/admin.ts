import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import {
  getAllSubmissions,
  getAllUsers,
  getPlatformStats,
} from "../controllers/adminController";

const router = Router();

router.get("/stats", authenticate, authorize("admin"), getPlatformStats);
router.get("/users", authenticate, authorize("admin"), getAllUsers);
router.get("/submissions", authenticate, authorize("admin"), getAllSubmissions);

export default router;
