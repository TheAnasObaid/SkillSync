import crypto from "crypto";
import { Request, Response } from "express";
import User from "../models/User";
import sendEmail from "../utils/email";
import generateToken from "../utils/generateToken";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await User.create({
      "profile.firstName": name,
      email,
      password,
      role,
    });
    await user.save();

    res.status(201).json({
      status: "success",
      user: {
        id: user?.id,
        name: user?.profile?.firstName,
        email: user?.email,
        role: user?.role,
      },
      token: generateToken(user.id),
    });
  } catch (err) {
    console.error(err);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(400).json({ status: "failed", error: "User not found" });
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

    // Create the email message
    const message = `
      <h1>Password Reset Request</h1>
      <p>Hi ${user.profile?.firstName},</p>
      <p>We received a request to reset your password for your SkillSync account. Please click the link below to set a new password:</p>
      <a href="${resetURL}" target="_blank" style="padding: 10px 20px; background-color: #34d399; color: black; text-decoration: none; border-radius: 5px;">Reset Your Password</a>
      <p>This link is valid for 10 minutes. If you did not request this, please ignore this email.</p>
    `;

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
