"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  const { setLoading } = useAuthStore();
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div>
      <h1 className="mb-10">Home</h1>
      <Link href="/challenges" className="link link-hover link-secondary">
        View challenges
      </Link>
    </div>
  );
}
