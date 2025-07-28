"use client";

import StatCard from "@/components/Admin/StatCard";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import Container from "@/components/Layout/Container";
import apiClient from "@/services/apiClient";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArchive, FiCheckSquare, FiClipboard, FiUsers } from "react-icons/fi";

interface PlatformStats {
  totalUsers: number;
  totalChallenges: number;
  completedChallenges: number;
  pendingSubmissions: number;
}

const AdminPanelPage = () => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get("/admin/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <ProtectedRoute requiredRole="admin">
      <Container>
        <div className="py-4 max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

          {loading ? (
            <div className="text-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  icon={<FiUsers size={32} />}
                  label="Total Users"
                  value={stats.totalUsers}
                />
                <StatCard
                  icon={<FiArchive size={32} />}
                  label="Total Challenges"
                  value={stats.totalChallenges}
                />
                <StatCard
                  icon={<FiCheckSquare size={32} />}
                  label="Completed Challenges"
                  value={stats.completedChallenges}
                />
                <StatCard
                  icon={<FiClipboard size={32} />}
                  label="Pending Submissions"
                  value={stats.pendingSubmissions}
                />
              </div>
            )
          )}

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl">Management Actions</h2>
              <div className="divider my-2"></div>
              <div className="card-actions justify-start">
                {/* Wrap buttons in Links to navigate */}
                <Link href="/admin/submissions" className="btn btn-primary">
                  <FiClipboard /> Review All Submissions
                </Link>
                <Link href="/admin/users" className="btn btn-secondary">
                  <FiUsers /> Manage All Users
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </ProtectedRoute>
  );
};

export default AdminPanelPage;
