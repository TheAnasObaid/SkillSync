import { Router } from "express";
import {
  forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
  verifyEmail,
} from "../controllers/authController";
import validate from "../middleware/validate";
import { loginSchema, registerSchema } from "../utils/validationSchemas";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), registerUser);
authRouter.post("/login", validate(loginSchema), loginUser);
authRouter.post("/forgot-password", forgotPassword);
authRouter.patch("/reset-password/:token", resetPassword);
authRouter.get("/verify-email/:token", verifyEmail);

export default authRouter;
