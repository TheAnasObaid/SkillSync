import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

export type Role = "developer" | "client" | "admin";

export interface UserDocument extends Document {
  email: string;
  password: string;
  role: Role;
  profile?: {
    firstName: string;
    lastName: string;
    companyName: string;
    avatar: string;
    bio: string;
    skills: Array<string>;
    experience: string;
    portfolio: Array<Object>;
    socialLinks: Object;
  };
  reputation?: {
    rating: number;
    totalRatings: number;
    completedChallenges: number;
  };
  isVerified: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
  passwordResetToken?: string; // Add this
  passwordResetExpires?: Date; // Add this
  comparePassword: (candidate: string) => Promise<boolean>;
  createPasswordResetToken(): string;
}

const UserSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["developer", "client", "admin"],
      default: "developer",
    },
    profile: {
      firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
      },
      lastName: { type: String },
      companyName: { type: String },
      avatar: { type: String },
      bio: { type: String },
      skills: { type: [String] },
      experience: { type: String },
      portfolio: { type: [Object] },
      socialLinks: { type: Object },
    },
    reputation: {
      rating: { type: Number },
      totalRatings: { type: Number },
      completedChallenges: { type: Number },
    },
    isVerified: { type: Boolean },
    lastLogin: { type: Date },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Token is valid for 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // Return the unhashed token to be "sent" to the user
  return resetToken;
};

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;
