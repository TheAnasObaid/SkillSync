"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export default function Home() {
  const { setLoading } = useAuthStore();
  useEffect(() => {
    setLoading(false);
  }, []);

  return <div>Homepage</div>;
}
