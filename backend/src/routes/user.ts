import { Router } from "express";
import {
  addPortfolioItem,
  deletePortfolioItem,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController";
import { authenticate, authorize } from "../middleware/auth";

const userRouter = Router();

userRouter.get("/profile", authenticate, getUserProfile);
userRouter.put("/profile", authenticate, updateUserProfile);
userRouter.post(
  "/profile/portfolio",
  authenticate,
  authorize("developer"),
  addPortfolioItem
);
userRouter.delete(
  "/profile/portfolio/:itemId",
  authenticate,
  authorize("developer"),
  deletePortfolioItem
);
export default userRouter;
