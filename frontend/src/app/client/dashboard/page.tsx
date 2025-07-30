"use client";

import StatCard from "@/components/Admin/StatCard";
import ClientChallengeList from "@/components/Challenge/ClientChallengeList";
import DashboardLayout, {
  DashboardLink,
} from "@/components/Layout/DashboardLayout";
import apiClient from "@/services/apiClient";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { BsGrid } from "react-icons/bs";
import { FiArchive, FiCheckSquare, FiClipboard, FiUser } from "react-icons/fi";
import { GoPlusCircle } from "react-icons/go";

interface ClientStats {
  totalChallengesPosted: number;
  activeChallenges: number;
  totalSubmissionsReceived: number;
}

const clientSidebarLinks: DashboardLink[] = [
  { href: "/client/dashboard", label: "Dashboard", icon: <BsGrid /> },
  {
    href: "/client/dashboard/challenges",
    label: "My Challenges",
    icon: <FiArchive />,
  },
  {
    href: "/client/dashboard/create",
    label: "Create Challenge",
    icon: <GoPlusCircle />,
  },
  { href: "/client/dashboard/profile", label: "My Profile", icon: <FiUser /> },
];

const ClientDashboardPage = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/users/profile/stats/client")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to fetch client stats", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout sidebarLinks={clientSidebarLinks}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.profile?.firstName}!
          </h1>
          <p className="text-base-content/70 mt-1">
            Here's a summary of your posted challenges.
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
                icon={<FiArchive size={32} />}
                label="Total Challenges"
                value={stats.totalChallengesPosted}
              />
              <StatCard
                icon={<FiCheckSquare size={32} />}
                label="Active Challenges"
                value={stats.activeChallenges}
              />
              <StatCard
                icon={<FiClipboard size={32} />}
                label="Submissions Received"
                value={stats.totalSubmissionsReceived}
              />
            </div>
          )
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recent Challenges</h2>
          {/* The ClientChallengeList handles its own data fetching and can be reused here */}
          <ClientChallengeList />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboardPage;
