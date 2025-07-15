"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export default function Home() {
  const { setLoading, setToken } = useAuthStore();
  useEffect(() => {
    setToken(localStorage.getItem("authToken"));
    setLoading(false);
  }, []);
  return <div>Homepage</div>;
}
