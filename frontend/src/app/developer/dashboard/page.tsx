"use client";

import StatCard from "@/components/Admin/StatCard";
import DeveloperSubmissionList from "@/components/Developer/DeveloperSubmissionList";
import DashboardLayout, {
  DashboardLink,
} from "@/components/Layout/DashboardLayout";
import apiClient from "@/services/apiClient";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import { FiAward, FiClipboard, FiClock, FiUser } from "react-icons/fi";
import { TbBriefcase2 } from "react-icons/tb";

interface DeveloperStats {
  totalSubmissions: number;
  winningSubmissions: number;
  pendingReviews: number;
}

const developerSidebarLinks: DashboardLink[] = [
  { href: "/developer/dashboard", label: "Dashboard", icon: <FiClipboard /> },
  {
    href: "/developer/dashboard/submissions",
    label: "My Submissions",
    icon: <TbBriefcase2 />,
  },
  {
    href: "/developer/dashboard/profile",
    label: "My Profile",
    icon: <FiUser />,
  },
];

const DeveloperDashboardPage = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DeveloperStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/users/profile/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to fetch stats", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout sidebarLinks={developerSidebarLinks}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.profile?.firstName}!
          </h1>
          <p className="text-base-content/70 mt-1">
            Here's a summary of your activity on SkillSync.
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <span className="loading loading-spinner"></span>
          </div>
        ) : (
          stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                icon={<FiClipboard size={32} />}
                label="Total Submissions"
                value={stats.totalSubmissions}
              />
              <StatCard
                icon={<FiAward size={32} />}
                label="Challenges Won"
                value={stats.winningSubmissions}
              />
              <StatCard
                icon={<FiClock size={32} />}
                label="Pending Reviews"
                value={stats.pendingReviews}
              />
            </div>
          )
        )}

        {/* We can show a preview of recent submissions here */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recent Submissions</h2>
          {/* The DeveloperSubmissionList component can be reused here, perhaps with a limit prop in the future */}
          <DeveloperSubmissionList />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DeveloperDashboardPage;
