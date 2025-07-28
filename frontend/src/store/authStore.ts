import { create } from "zustand";

export type Role = "developer" | "client" | "admin" | null;

type User = {
  name: string;
  email: string;
  role: Role;
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
