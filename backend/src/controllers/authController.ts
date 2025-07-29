import crypto from "crypto";
import { Request, Response } from "express";
import User from "../models/User";
import sendEmail from "../utils/email";
import generateToken from "../utils/generateToken";

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

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await User.create({
      "profile.firstName": name,
      email,
      password,
      role,
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    await user.save({ validateBeforeSave: false });

    // Send verification email
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
  } catch (err: unknown) {
    console.error(err);
    // Handle duplicate email error
    if (typeof err === "object" && err !== null && "code" in err) {
      // Now TypeScript knows that `err` has a `code` property inside this block.
      const error = err as { code?: number }; // We can cast it to a more specific type
      if (error.code === 11000) {
        res
          .status(409)
          .json({ message: "An account with this email already exists." });
        return;
      }
    }
    res.status(500).json({ message: "Registration failed." });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({ verificationToken: hashedToken });

    if (!user) {
      res
        .status(400)
        .json({ message: "Invalid or expired verification token." });
      return;
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save({ validateBeforeSave: false });

    res
      .status(200)
      .json({ status: "success", message: "Email verified successfully." });
  } catch (error) {
    res.status(500).json({ message: "Email verification failed." });
  }
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    // Important: We only proceed if the user exists AND is not already verified.
    if (!user || user.isVerified) {
      res.status(200).json({
        message:
          "If an account with that email exists and is unverified, a new verification link has been sent.",
      });
      return;
    }

    // Generate a new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    await user.save({ validateBeforeSave: false });

    // Send the new verification email using our template
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
  } catch (err) {
    console.error("Resend verification email error:", err);
    res.status(500).json({ message: "Failed to resend verification email." });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
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

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    res.status(400).json({ status: "failed", error: "Invalid credentials" });
    return;
  }

  // --- START OF CHANGE ---

  // Instead of creating a simplified object like { name: user.profile.firstName, ... }
  // Send the entire user object, which already has the correct structure.
  // We can manually remove the password to be safe, although .select('-password') on a new query would also work.
  const userPayload = user.toObject();

  res.status(200).json({
    status: "success",
    user: userPayload, // Send the correctly structured user object
    token: generateToken(user.id),
  });
};

export const forgotPassword = async (req: Request, res: Response) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    // We send a generic success message even if the user isn't found
    // This prevents attackers from guessing which emails are registered.
    res.status(200).json({
      status: "success",
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
    return;
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const message = createStyledEmail(
      "Password Reset Request",
      "Reset your SkillSync password.",
      user.profile!.firstName,
      "We received a request to reset your password. Click the button below to choose a new one. This link is valid for 10 minutes.",
      resetURL,
      "Reset Your Password"
    );

    // Use our email service to send the email
    await sendEmail({
      email: user.email,
      subject: "Your SkillSync Password Reset Link (Valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "A password reset link has been sent to your email.",
    });
  } catch (err) {
    // If the email fails to send, we must reset the token fields in the DB
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    console.error("EMAIL ERROR:", err);
    res.status(500).json({
      message:
        "There was an error sending the password reset link. Please try again later.",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, // Check if token is not expired
  });

  // 2) If token has not expired, and there is a user, set the new password
  if (!user) {
    res.status(400).json({ message: "Token is invalid or has expired." });
    return;
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save(); // The pre-save hook will automatically hash the new password

  // 3) Log the user in and send a new JWT
  res.status(200).json({
    status: "success",
    token: generateToken(String(user._id)),
  });
};
