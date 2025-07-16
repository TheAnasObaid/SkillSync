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
    <ProtectedRoute requiredRole="client">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Client Dashboard</h1>
        <p>Form to create a new challenge will appear here.</p>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
