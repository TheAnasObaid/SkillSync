// --- GENERIC TYPES ---
export interface File {
  name: string;
  path: string;
}

// --- USER RELATED TYPES ---
export type Role = "developer" | "client" | "admin";
export type AccountStatus = "active" | "banned";

export interface PortfolioItem {
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
}

// This represents the USER data object as it exists in JSON
export interface IUser {
  _id: string;
  email: string;
  role: Role;
  accountStatus: AccountStatus;
  profile: {
    firstName: string;
    lastName?: string;
    companyName?: string;
    avatar?: string;
    bio?: string;
    skills: string[];
    experience?: string;
    portfolio: PortfolioItem[];
  };
  reputation: {
    rating: number;
    completedChallenges: number;
  };
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- CHALLENGE RELATED TYPES ---
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
  prize: string;
  createdBy: string | IUser;
  requirements: string;
  category?: string;
  difficulty: ChallengeDifficulty;
  deadline: string;
  status: ChallengeStatus;
  submissions: string[];
  files: File[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// --- SUBMISSION RELATED TYPES ---
export type SubmissionStatus = "pending" | "reviewed" | "winner" | "rejected";

export interface ISubmission {
  _id: string;
  challengeId:
    | string
    | {
        _id: string;
        title: string;
        status: string;
        prize?: number;
      };
  developerId:
    | string
    | {
        _id: string;
        email?: string;
        profile: {
          firstName: string;
          avatar?: string;
        };
      };
  githubRepo: string;
  liveDemo?: string;
  description: string;
  status: SubmissionStatus;
  files: File[];
  ratings?: {
    overall: number;
  };
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicSubmission {
  _id: string;
  githubRepo: string;
  liveDemo?: string;
  description: string;
  challengeId:
    | string
    | {
        _id: string;
        title: string;
        status: string;
        prize?: number;
      };
  status: SubmissionStatus;
  files: File[];
  updatedAt: string;
  developerId: {
    _id: string;
    profile: {
      firstName: string;
      avatar: string;
    };
  };
  createdAt: string;
}

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
