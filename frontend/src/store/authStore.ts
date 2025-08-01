import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IUser } from "@/types";
import axios from "axios";

interface AuthState {
  token: string | null;
  user: IUser | null;
}

interface AuthActions {
  setToken: (token: string) => void;
  setUser: (user: IUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setToken: (token: string) => {
        set({ token });
      },

      setUser: (user: IUser) => {
        set({ user });
      },

      logout: () => {
        axios.post("/api/auth", { token: null });
        set({ token: null, user: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),

      onRehydrateStorage: (state) => {
        console.log("Zustand store has been rehydrated from localStorage.");
      },
    }
  )
);
