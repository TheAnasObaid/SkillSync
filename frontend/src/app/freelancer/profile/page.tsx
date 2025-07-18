"use client";

import ProtectedRoute from "@/app/ProtectedRoute";

const ProfilePage = () => {
  return (
    <ProtectedRoute requiredRole="developer">
      <div className="p-4">
        <div className="flex justify-between mb-10">
          <h1 className="text-2xl font-bold">Freelancer</h1>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
