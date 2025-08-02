// --- GENERIC TYPES ---
export interface File {
  name: string;
  path: string;
}

// --- USER RELATED TYPES ---
export type Role = "developer" | "client" | "admin";
export type AccountStatus = "active" | "banned";

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
  content: string;
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

export interface DashboardLink {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

export interface PortfolioItem {
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
  profile: {
    lastName: string;
    bio: string;
    skills: string;
    experience: string;
  };
}

// --- NEW TYPES FOR DASHBOARD COMPONENTS ---

/**
 * @interface StatCardProps
 * @desc Props for the reusable StatCard component.
 * @property {ReactNode} icon - The icon to be displayed in the card.
 * @property {string} label - The descriptive label for the statistic.
 * @property {number | string} value - The main value of the statistic.
 * @property {string} [link] - Optional URL for a "call to action" link.
 * @property {string} [linkText] - Optional text for the link (defaults to "View all").
 * @property {'primary' | 'secondary' | 'accent' | 'success' | 'info'} [color] - Optional theme color for styling accents on the card.
 */
export interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  link?: string;
  linkText?: string;
  color?: "green" | "blue" | "orange" | "red";
}

/**
 * @interface PlatformStats
 * @desc The shape of the statistics object for the Admin dashboard.
 */
export interface PlatformStats {
  totalUsers: number;
  totalChallenges: number;
  completedChallenges: number;
  pendingSubmissions: number;
}

/**
 * @interface ClientStats
 * @desc The shape of the statistics object for the Client dashboard.
 */
export interface ClientStats {
  totalChallengesPosted: number;
  activeChallenges: number;
  totalSubmissionsReceived: number;
}

/**
 * @interface DeveloperStats
 * @desc The shape of the statistics object for the Developer dashboard.
 */
export interface DeveloperStats {
  totalSubmissions: number;
  winningSubmissions: number;
  pendingReviews: number;
}
// src/types/index.ts

// ... (keep all your other types like IUser, IChallenge, etc.)

// --- NEW OR UPDATED TYPES FOR PORTFOLIO ---

/**
 * @interface IPortfolioItem
 * @desc Represents a single portfolio item as it is stored in the database and sent from the API.
 * @property {string} [_id] - The unique identifier from MongoDB.
 * @property {string} title - The title of the project.
 * @property {string} description - A description of the project.
 * @property {string} imageUrl - The server path or URL to the project's image.
 * @property {string} [liveUrl] - An optional URL to the live deployment.
 * @property {string} [githubUrl] - An optional URL to the project's GitHub repository.
 */
export interface IPortfolioItem {
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
}

/**
 * @interface PortfolioFormData
 *- @desc Represents the raw data captured from the "Add/Edit Portfolio Project" form.
 * @note This is kept separate from IPortfolioItem because the form handles the image as a FileList,
 *       whereas the final data object has a string URL.
 * @property {string} title - The title of the project.
 * @property {string} description - A description of the project.
 * @property {string} [liveUrl] - An optional URL to the live deployment.
 * @property {string} [githubUrl] - An optional URL to the project's GitHub repository.
 * @property {FileList} [portfolioImage] - The image file selected by the user in the form.
 */
export interface PortfolioFormData {
  title: string;
  description: string;
  liveUrl?: string;
  githubUrl?: string;
  portfolioImage?: FileList;
}

/**
 * @interface ProfileFormData
 * @desc Represents the data captured from the main developer profile edit form.
 */
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
