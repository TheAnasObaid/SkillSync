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
    <ProtectedRoute requiredRole="admin">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p>Review submissions and manage users here.</p>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
