"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { setToken, setLoading } = useAuthStore();

  useEffect(() => {
    setToken(localStorage.getItem("authToken"));
    setLoading(false);
  }, []);

  return <div>{children}</div>;
};

export default AuthGuard;
