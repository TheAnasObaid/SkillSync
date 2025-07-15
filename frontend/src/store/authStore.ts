import { create } from "zustand";

export type Role = "developer" | "client" | "admin" | null;

type AuthState = {
  token: string | null;
  role: Role;
  loading: boolean;
  setToken: (token: string | null) => void;
  setRole: (role: Role) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token:
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null,
  role:
    typeof window !== "undefined"
      ? (localStorage.getItem("authRole") as Role)
      : null,
  loading: true,
  setToken: (token) => {
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("authToken", token);
      } else {
        localStorage.removeItem("authToken");
      }
    }
    set({ token });
  },
  setRole: (role) => {
    if (typeof window !== "undefined") {
      if (role) {
        localStorage.setItem("authRole", role);
      } else {
        localStorage.removeItem("authRole");
      }
    }
    set({ role });
  },
  setLoading: (loading) => set({ loading }),
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authRole");
    }
    set({ token: null, role: null, loading: false });
  },
}));
