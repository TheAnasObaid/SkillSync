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
      <div>Freelancer Profile</div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
