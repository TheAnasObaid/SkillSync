import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController";
import { authenticate } from "../middleware/auth";

const userRouter = Router();

userRouter.get("/profile", authenticate, getUserProfile);

userRouter.put("/profile", authenticate, updateUserProfile);

export default userRouter;
