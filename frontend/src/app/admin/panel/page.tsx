"use client";

import ProtectedRoute from "@/components/Auth/ProtectedRoute";

const ProfilePage = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="grid gap-5">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <p>Review submissions and manage users here.</p>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
