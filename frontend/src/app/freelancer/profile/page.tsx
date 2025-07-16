"use client";

import ProtectedRoute from "@/app/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

const ProfilePage = () => {
  const { setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <ProtectedRoute requiredRole="developer">
      <div className="p-4">
        <div className="flex justify-between mb-10">
          <h1 className="text-2xl font-bold">Developer Dashboard</h1>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
