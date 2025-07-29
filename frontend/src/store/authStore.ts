import { PortfolioItem } from "@/components/Profile/PortfolioCard";
import { create } from "zustand";

export type Role = "developer" | "client" | "admin" | null;

export type User = {
  email: string;
  // This password field is likely incorrect in a user store, but we'll leave it for now
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
    portfolio: PortfolioItem[]; // <-- 2. UPDATE THIS LINE from Array<Object> to PortfolioItem[]
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
    }
    set({ token: null, user: null, loading: false });
  },
}));
