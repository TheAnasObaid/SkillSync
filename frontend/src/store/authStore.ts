import { IUser } from "@/types";
import axios from "axios";
import { create } from "zustand";

type AuthState = {
  token: string | null;
  user: IUser | null;
  loading: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: IUser) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
};

const getInitialUser = (): IUser | null => {
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
      axios.post("/api/auth", { token: null });
    }
    set({ token: null, user: null });
  },
}));
