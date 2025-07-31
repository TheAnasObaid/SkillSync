import { PortfolioItem } from "@/components/Profile/PortfolioCard";
import axios from "axios";
import { create } from "zustand";

export type Role = "developer" | "client" | "admin";
export type AccountStatus = "active" | "banned";

export type User = {
  _id: string;
  email: string;
  password: string;
  role: Role;
  accountStatus: AccountStatus;
  profile?: {
    firstName: string;
    lastName: string;
    companyName: string;
    avatar: string;
    bio: string;
    skills: Array<string>;
    experience: string;
    portfolio: PortfolioItem[];
    socialLinks: Object;
  };
  reputation?: {
    rating: number;
    totalRatings: number;
    completedChallenges: number;
  };
  isVerified: boolean;
  lastLogin: Date;
  createdAt: Date | string | number;
  updatedAt: Date;
  comparePassword: (candidate: string) => Promise<boolean>;
} | null;

type AuthState = {
  token: string | null;
  user: User;
  loading: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
};

const getInitialUser = (): User => {
  if (typeof window === "undefined") return null;
  const storedUser = localStorage.getItem("authUser");
  return storedUser ? JSON.parse(storedUser) : null;
};

export const useAuthStore = create<AuthState>((set) => ({
  token:
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null,
  user: getInitialUser(),
  loading: true,

  setToken: (token) => {
    if (typeof window !== "undefined") {
      token
        ? localStorage.setItem("authToken", token)
        : localStorage.removeItem("authToken");
    }
    set({ token });
  },

  setUser: (user) => {
    if (typeof window !== "undefined") {
      user
        ? localStorage.setItem("authUser", JSON.stringify(user))
        : localStorage.removeItem("authUser");
    }
    set({ user });
  },

  setLoading: (loading) => set({ loading }),

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      // --- NEW ---
      // Call our API route to clear the server-side cookie
      axios.post("/api/auth", { token: null });
    }
    set({ token: null, user: null });
  },
}));
