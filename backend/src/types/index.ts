import { Document, Types } from "mongoose";

// A generic type for our file uploads
export interface File {
  name: string;
  path: string;
}

// --- USER RELATED TYPES ---
export type Role = "developer" | "client" | "admin";
export type AccountStatus = "active" | "banned";

export interface IPortfolioItem {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
}

// This is the main User interface that will be used across the app
export interface IUser extends Document {
  email: string;
  password?: string;
  role: Role;
  accountStatus: AccountStatus;
  earnings?: number;
  profile: {
    firstName: string;
    lastName?: string;
    companyName?: string;
    avatar?: string;
    bio?: string;
    skills: string[];
    experience?: string;
    portfolio: IPortfolioItem[];
    socialLinks?: Record<string, string>;
  };
  reputation: {
    rating: number;
    totalRatings: number;
    completedChallenges: number;
  };
  isVerified: boolean;
  lastLogin?: Date;
  verificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;

  // Methods
  comparePassword(candidate: string): Promise<boolean>;
  createPasswordResetToken(): string;
}

// --- CHALLENGE RELATED TYPES ---
export type ChallengeStatus =
  | "draft"
  | "published"
  | "active"
  | "judging"
  | "completed";

export type ChallengeDifficulty = "beginner" | "intermediate" | "advanced";

export interface IChallenge extends Document {
  title: string;
  description: string;
  prize: number;
  isFunded?: boolean;
  createdBy: Types.ObjectId;
  requirements: string;
  category?: string;
  difficulty: ChallengeDifficulty;
  deadline: Date;
  status: ChallengeStatus;
  submissions: Types.ObjectId[];
  judgingCriteria?: {
    codeQuality: number;
    functionality: number;
    creativity: number;
    documentation: number;
  };
  files: File[];
  tags: string[];
}

// --- SUBMISSION RELATED TYPES ---
export type SubmissionStatus = "pending" | "reviewed" | "winner" | "rejected";

export interface ISubmission extends Document {
  challengeId: Types.ObjectId;
  developerId: Types.ObjectId;
  githubRepo: string;
  liveDemo?: string;
  description: string;
  status: SubmissionStatus;
  files: File[];
  ratings?: {
    overall: number;
  };
  feedback?: string;
  updatedAt: Date;
}
