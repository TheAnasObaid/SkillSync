import crypto from "crypto";
import { Request, Response } from "express";
import User from "../models/User";
import sendEmail from "../services/emailService";
import { generateToken } from "../services/tokenService";
import { LoginDto, RegisterDto } from "../utils/validationSchemas";
import asyncHandler from "../utils/asyncHandler";

const createStyledEmail = (
  title: string,
  preheader: string,
  name: string,
  body: string,
  buttonLink: string,
  buttonText: string
) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #1a1a1a; color: #e6e6e6; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #161616; border: 1px solid #262626; border-radius: 12px; overflow: hidden; }
            .header { padding: 20px; text-align: center; border-bottom: 1px solid #262626; }
            .header h1 { margin: 0; color: #00fb7f; font-weight: bold; }
            .content { padding: 30px; }
            .content p { color: #eeeeee; line-height: 1.6; margin: 0 0 15px; }
            .button-container { text-align: center; margin: 30px 0; }
            .button { background-color: #00fb7f; color: #161616; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #808080; border-top: 1px solid #262626; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header"><h1>SkillSync</h1></div>
            <div class="content">
                <p>Hi ${name},</p>
                <p>${body}</p>
                <div class="button-container">
                    <a href="${buttonLink}" target="_blank" class="button">${buttonText}</a>
                </div>
                <p>If you did not request this, please ignore this email.</p>
            </div>
            <div class="footer">
                © ${new Date().getFullYear()} SkillSync. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
};

/**
 * @desc    Register a new user (developer or client)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password, role }: RegisterDto = req.body;
    const user = await User.create({
      "profile.firstName": name,
      email,
      password,
      role,
    });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    await user.save({ validateBeforeSave: false });
    const verificationURL = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    const message = createStyledEmail(
      "Welcome to SkillSync!",
      "Verify your email to get started.",
      name,
      "Thank you for registering with SkillSync. Please click the button below to verify your email address and activate your account.",
      verificationURL,
      "Verify Your Email"
    );

    await sendEmail({
      email: user.email,
      subject: "Welcome to SkillSync - Please Verify Your Email",
      message,
    });

    res.status(201).json({
      status: "success",
      message:
        "Registration successful! Please check your email to verify your account.",
      // We don't send the user/token until they are verified
    });
  }
);

/**
 * @desc    Authenticate a user and get a token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: LoginDto = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(400).json({ status: "failed", error: "User not found" });
    return;
  }

  if (!user.isVerified) {
    res
      .status(403)
      .json({ message: "Please verify your email before logging in." });
    return;
  }

  if (user.accountStatus === "banned") {
    res
      .status(403)
      .json({ status: "failed", error: "Your account has been suspended." });
    return;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = generateToken(user.id);
  const userPayload = user.toObject();
  delete userPayload.password;

  res.status(200).json({
    status: "success",
    user: userPayload,
    token,
  });
});

/**
 * @desc    Verify a new user's email address
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({ verificationToken: hashedToken });
  if (!user) {
    res.status(400).json({ message: "Invalid or expired verification token." });
    return;
  }

  user.isVerified = true;
  user.verificationToken = undefined;

  await user.save({ validateBeforeSave: false });
  res
    .status(200)
    .json({ status: "success", message: "Email verified successfully." });
});

/**
 * @desc    Verify a new user's email address
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
export const resendVerificationEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Important: We only proceed if the user exists AND is not already verified.
    if (!user || user.isVerified) {
      res.status(200).json({
        message:
          "If an account with that email exists and is unverified, a new verification link has been sent.",
      });
      return;
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    await user.save({ validateBeforeSave: false });

    const verificationURL = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    const message = createStyledEmail(
      "Resend Verification Email",
      "Verify your email to get started.",
      user.profile!.firstName,
      "We received a request to resend your verification email. Please click the button below to activate your account.",
      verificationURL,
      "Verify Your Email"
    );
    await sendEmail({
      email: user.email,
      subject: "SkillSync - Resend Verification Email",
      message,
    });

    res.status(200).json({
      message: "A new verification link has been sent to your email.",
    });
  }
);

/**
 * @desc    Initiate the password reset process
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(200).json({
        status: "success",
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
      return;
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const message = createStyledEmail(
      "Password Reset Request",
      "Reset your SkillSync password.",
      user.profile!.firstName,
      "We received a request to reset your password. Click the button below to choose a new one. This link is valid for 10 minutes.",
      resetURL,
      "Reset Your Password"
    );
    await sendEmail({
      email: user.email,
      subject: "Your SkillSync Password Reset Link (Valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "A password reset link has been sent to your email.",
    });
  }
);

/**
 * @desc    Reset a user's password using a token
 * @route   PATCH /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }, // Check if token is not expired
    });

    if (!user) {
      res.status(400).json({ message: "Token is invalid or has expired." });
      return;
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    res.status(200).json({
      status: "success",
      token: generateToken(String(user._id)),
    });
  }
);
