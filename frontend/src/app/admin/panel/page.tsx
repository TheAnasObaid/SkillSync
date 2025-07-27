"use client";

import ProtectedRoute from "@/components/Auth/ProtectedRoute";

const ProfilePage = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="h-screen grid grid-rows-[auto_1fr_auto]">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <p>Review submissions and manage users here.</p>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
