// --- GENERIC TYPES ---
export interface File {
  name: string;
  path: string;
}

// --- USER RELATED TYPES ---
export type Role = "developer" | "client" | "admin";
export type AccountStatus = "active" | "banned";

export interface PortfolioItem {
  _id?: string; // ID is a string
  title: string;
  description: string;
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
}

// This represents the USER data object as it exists in JSON
export interface IUser {
  _id: string; // ID is a string
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
  createdAt: string; // Dates are strings in JSON
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
  _id: string; // ID is a string
  title: string;
  description: string;
  prize: number;
  createdBy: string | IUser; // Can be a string ID or a populated User object
  requirements: string;
  category?: string;
  difficulty: ChallengeDifficulty;
  deadline: string; // Date is a string
  status: ChallengeStatus;
  submissions: string[]; // Array of string IDs
  files: File[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// --- SUBMISSION RELATED TYPES ---
export type SubmissionStatus = "pending" | "reviewed" | "winner" | "rejected";

export interface ISubmission {
  _id: string; // ID is a string
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
        // Can be a string ID or a populated Developer object
        _id: string;
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
