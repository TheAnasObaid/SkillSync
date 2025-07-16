"use client";

import ProtectedRoute from "@/app/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useEffect } from "react";

const ProfilePage = () => {
  const { setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <ProtectedRoute requiredRole="client">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Client Dashboard</h1>
        <Link href="profile/challenge" className="btn btn-secondary mt-5">
          Create Challenge
        </Link>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
