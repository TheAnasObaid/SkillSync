import { Request, Response } from "express";
import User from "../models/User";
import generateToken from "../utils/generateToken";
import crypto from "crypto";
import { AuthenticatedRequest } from "../middleware/auth";

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
  console.log(userPayload);

  res.status(200).json({
    status: "success",
    user: userPayload, // Send the correctly structured user object
    token: generateToken(user.id),
  });
};

// 1. FORGOT PASSWORD
export const forgotPassword = async (req: Request, res: Response) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404).json({ message: "No user found with that email address." });
    return;
  }

  // 2) Generate the random reset token using the method we just created
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); // Save the user with the new reset fields

  // 3) "Send" it to the user's email (for now, we'll send it back in the response for testing)
  // In a real app, this is where you would call your email service.
  try {
    // THIS IS OUR DUMMY IMPLEMENTATION
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/reset-password/${resetToken}`;
    console.log("DUMMY PASSWORD RESET LINK:", resetURL);

    res.status(200).json({
      status: "success",
      message: "Token sent! (Check console for the dummy link)",
      // We send the token back directly for easy testing without an email client.
      // In production, you would remove this line.
      resetTokenForTesting: resetToken,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({
      message:
        "There was an error sending the reset link. Please try again later.",
    });
  }
};

// 2. RESET PASSWORD
export const resetPassword = async (req: Request, res: Response) => {
  // 1) Get user based on the token from the URL
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
