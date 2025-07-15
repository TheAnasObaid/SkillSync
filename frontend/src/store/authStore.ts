import { create } from "zustand";

type AuthState = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  loading: true,
  setLoading: (loading) => set({ loading }),
  token: null,
  setToken: (token) => set({ token }),
  logout: () => {
    localStorage.removeItem("authToken");
    return set({ token: null });
  },
}));
