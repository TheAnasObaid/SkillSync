import { Router } from "express";
import {
  addMyPortfolioItem,
  deleteMyPortfolioItem,
  getMe,
  getMyClientStats,
  getMyDeveloperStats,
  getUserById,
  updateMyProfile,
  uploadMyAvatar,
} from "../controllers/userController";
import { authenticate, authorize } from "../middleware/auth";

const userRouter = Router();

// --- Routes for the LOGGED-IN user (/api/users/me/...) ---
const meRouter = Router();
meRouter.use(authenticate);

meRouter.get("/", getMe);
meRouter.put("/", updateMyProfile);
meRouter.post("/avatar", uploadMyAvatar);
meRouter.post("/portfolio", authorize("developer"), addMyPortfolioItem);
meRouter.delete(
  "/portfolio/:itemId",
  authorize("developer"),
  deleteMyPortfolioItem
);
meRouter.get("/stats/developer", authorize("developer"), getMyDeveloperStats);
meRouter.get("/stats/client", authorize("client"), getMyClientStats);

userRouter.use("/me", meRouter);

// --- Routes for PUBLIC user data ---
userRouter.get("/:id", getUserById);

export default userRouter;
