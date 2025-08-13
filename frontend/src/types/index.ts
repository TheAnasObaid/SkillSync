import { ReactNode } from "react";

export type Serializable<T> = {
  [P in keyof T]: T[P] extends Date ? string : T[P];
};

export interface IFile {
  name: string;
  path: string;
}

export type Role = "developer" | "client" | "admin";
export type AccountStatus = "active" | "banned";

export interface IPortfolioItem {
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
}

export interface IUser {
  _id: string;
  email: string;
  role: Role;
  accountStatus: AccountStatus;
  earnings: number;
  profile: {
    firstName: string;
    lastName?: string;
    companyName?: string;
    avatar?: string;
    bio?: string;
    skills: string[];
    experience?: string;
    portfolio: IPortfolioItem[];
  };
  reputation: {
    rating: number;
    totalRatings: number;
    completedChallenges: number;
  };
  isVerified: boolean;
  verificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date; // Correct type is Date
  lastLogin?: Date; // Correct type is Date
  createdAt: Date; // Correct type is Date
  updatedAt: Date; // Correct type is Date
}

export type ChallengeStatus =
  | "draft"
  | "published"
  | "active"
  | "judging"
  | "completed";

export type ChallengeDifficulty = "beginner" | "intermediate" | "advanced";

export interface IChallenge {
  _id: string;
  title: string;
  description: string;
  requirements: string;
  prize: number;
  category: string;
  difficulty: ChallengeDifficulty;
  status: ChallengeStatus;
  tags: string[];
  isFunded: boolean;
  createdBy: string | IUser; // Can be a string ID or a populated IUser object
  submissions: string[] | ISubmission[]; // Can be an array of IDs or populated objects
  files: IFile[];
  deadline: Date; // Correct type is Date
  createdAt: Date; // Correct type is Date
  updatedAt: Date; // Correct type is Date
}

export type SubmissionStatus = "pending" | "reviewed" | "winner" | "rejected";

export interface ISubmission {
  _id: string;
  githubRepo: string;
  description: string;
  liveDemo?: string;
  status: SubmissionStatus;
  challengeId: string | IChallenge; // Can be a string ID or a populated IChallenge object
  developerId: string | IUser; // Can be a string ID or a populated IUser object
  files: IFile[];
  ratings?: { overall: number };
  feedback?: string;
  createdAt: Date; // Correct type is Date
  updatedAt: Date; // Correct type is Date
}

// --- API & STATS TYPES ---

export interface PlatformStats {
  totalUsers: number;
  totalChallenges: number;
  completedChallenges: number;
  pendingSubmissions: number;
}

export interface ClientStats {
  totalChallengesPosted: number;
  activeChallenges: number;
  totalSubmissionsReceived: number;
}

export interface DeveloperStats {
  totalSubmissions: number;
  winningSubmissions: number;
  pendingReviews: number;
}

// --- UI & FORM-SPECIFIC TYPES ---

export interface DashboardLink {
  href: string;
  label: string;
  icon?: ReactNode;
}

export interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  link?: string;
  linkText?: string;
  color?: "green" | "blue" | "orange" | "red";
}

// Form data for adding a portfolio item for developer
export interface DeveloperPortfolioFormData {
  title: string;
  description: string;
  liveUrl?: string;
  githubUrl?: string;
  portfolioImage?: FileList;
}

// Form data for editing a developer profile
export interface DeveloperProfileFormData {
  name: string;
  email: string;
  profile: {
    lastName: string;
    bio: string;
    skills: string;
    experience: string;
  };
}

// Form data for editing a client profile
export interface ClientProfileFormData {
  name: string;
  profile: {
    lastName: string;
    companyName: string;
    bio: string;
  };
}
