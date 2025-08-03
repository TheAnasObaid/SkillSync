import bcrypt from "bcrypt";
import crypto from "crypto";
import mongoose, { Schema } from "mongoose";
import { IUser } from "../types";

const IPortfolioItemSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  imageUrl: { type: String, required: true },
  liveUrl: { type: String, trim: true },
  githubUrl: { type: String, trim: true },
});

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ["developer", "client", "admin"],
      default: "developer",
    },
    accountStatus: {
      type: String,
      enum: ["active", "banned"],
      default: "active",
    },
    profile: {
      firstName: { type: String, required: true, trim: true, minlength: 2 },
      lastName: String,
      companyName: String,
      avatar: String,
      bio: String,
      skills: [String],
      experience: String,
      portfolio: [IPortfolioItemSchema],
      socialLinks: Object,
    },
    reputation: {
      rating: { type: Number, default: 0 },
      totalRatings: { type: Number, default: 0 },
      completedChallenges: { type: Number, default: 0 },
    },
    isVerified: { type: Boolean, default: false },
    lastLogin: Date,
    verificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// --- MIDDLEWARE & METHODS ---
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password!, salt);
  next();
});

UserSchema.methods.comparePassword = function (
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  return resetToken;
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
