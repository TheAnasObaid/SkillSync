import { Router } from "express";
import {
  addPortfolioItem,
  deletePortfolioItem,
  getClientStats,
  getDeveloperStats,
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
} from "../controllers/userController";
import { authenticate, authorize } from "../middleware/auth";

const userRouter = Router();

userRouter.get("/profile", authenticate, getUserProfile);
userRouter.put("/profile", authenticate, updateUserProfile);
userRouter.post("/upload-avatar", authenticate, uploadAvatar);
userRouter.get(
  "/profile/stats",
  authenticate,
  authorize("developer"),
  getDeveloperStats
);
userRouter.post("/profile/portfolio", authenticate, addPortfolioItem);
userRouter.delete(
  "/profile/portfolio/:itemId",
  authenticate,
  authorize("developer"),
  deletePortfolioItem
);
userRouter.get(
  "/profile/stats/client",
  authenticate,
  authorize("client"),
  getClientStats
);

export default userRouter;
