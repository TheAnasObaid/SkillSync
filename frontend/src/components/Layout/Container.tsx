"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
  const { setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(false);
  }, []);

  return <div className="max-w-7xl mx-auto w-full">{children}</div>;
};

export default Container;
