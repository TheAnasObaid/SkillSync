import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import {
  deleteChallengeByAdmin,
  getAllSubmissions,
  getAllUsers,
  getPlatformStats,
  updateUserByAdmin,
} from "../controllers/adminController";

const router = Router();

router.get("/stats", authenticate, authorize("admin"), getPlatformStats);
router.get("/users", authenticate, authorize("admin"), getAllUsers);
router.get("/submissions", authenticate, authorize("admin"), getAllSubmissions);
router.patch(
  "/users/:userId",
  authenticate,
  authorize("admin"),
  updateUserByAdmin
);
router.delete(
  "/challenges/:challengeId",
  authenticate,
  authorize("admin"),
  deleteChallengeByAdmin
);

export default router;
