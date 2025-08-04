// ===== File: frontend\src\types\index.ts =====
import { ReactNode } from "react";

// --- GENERIC & SHARED TYPES ---
export interface File {
  name: string;
  path: string;
}

export type Role = "developer" | "client" | "admin";
export type AccountStatus = "active" | "banned";

// --- DATA MODELS (matching the backend) ---
export interface IIPortfolioItem {
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
  earnings?: number;
  profile: {
    firstName: string;
    lastName?: string;
    companyName?: string;
    avatar?: string;
    bio?: string;
    skills: string[];
    experience?: string;
    portfolio: IIPortfolioItem[];
  };
  reputation: {
    rating: number;
    totalRatings: number; // FIX: Added this missing field
    completedChallenges: number;
  };
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
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
  prize: number; // FIX: Changed from string to number
  isFunded?: boolean;
  createdBy: string | IUser; // Can be populated
  requirements: string;
  category?: string;
  difficulty: ChallengeDifficulty;
  deadline: string; // Sticking with string for easier date input handling
  status: ChallengeStatus;
  submissions: string[];
  files: File[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type SubmissionStatus = "pending" | "reviewed" | "winner" | "rejected";

export interface ISubmission {
  _id: string;
  challengeId:
    | string
    | { _id: string; title: string; status: string; prize?: number };
  developerId:
    | string
    | {
        _id: string;
        email?: string;
        profile: { firstName: string; avatar?: string };
      };
  githubRepo: string;
  liveDemo?: string;
  description: string; // FIX: Removed 'content' in favor of 'description' for consistency
  status: SubmissionStatus;
  files: File[];
  ratings?: { overall: number };
  feedback?: string;
  createdAt: string;
  updatedAt: string;
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

// --- UI & FORM TYPES ---
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

export interface PortfolioFormData {
  title: string;
  description: string;
  liveUrl?: string;
  githubUrl?: string;
  portfolioImage?: FileList;
}

export interface ProfileFormData {
  name: string;
  email: string;
  profile: {
    lastName: string;
    bio: string;
    skills: string; // Skills are a comma-separated string in the form
    experience: string;
  };
}
