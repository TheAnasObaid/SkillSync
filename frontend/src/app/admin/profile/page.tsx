"use client";

import ProtectedRoute from "@/app/ProtectedRoute";

const ProfilePage = () => {
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
