"use client";

import ProtectedRoute from "@/components/Auth/ProtectedRoute";

const Dashboard = () => {
  return (
    <ProtectedRoute requiredRole="developer">
      <div className="h-screen grid grid-rows-[auto_1fr_auto]">
        <main className="grid gap-5">
          <h2 className="text-2xl font-bold">Developer</h2>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
