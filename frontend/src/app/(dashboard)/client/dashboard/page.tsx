import DashboardLayout from "@/components/Layout/DashboardLayout";
import { getMyChallenges } from "@/services/server/challengeService";
import { getMyClientStats } from "@/services/server/userService";
import { clientSidebarLinks } from "@/config/dashboard";
import { FiArchive, FiCheckSquare, FiClipboard } from "react-icons/fi";
import RecentChallengePreview from "@/components/Client/RecentChallengePreview"; // <-- Import the new component
import Link from "next/link";
import StatCardGrid, { StatItem } from "@/components/Common/StatCardGrid";

const ClientDashboardPage = async () => {
  const [statsData, allChallengesData] = await Promise.all([
    getMyClientStats(),
    getMyChallenges(),
  ]);

  const recentChallenges = allChallengesData.slice(0, 3);

  const clientStats: StatItem[] = statsData
    ? [
        {
          icon: <FiArchive size={24} />,
          label: "Total Challenges",
          value: statsData.totalChallengesPosted,
          color: "green",
          link: "/client/dashboard/challenges",
        },
        {
          icon: <FiCheckSquare size={24} />,
          label: "Active Challenges",
          value: statsData.activeChallenges,
          color: "blue",
        },
        {
          icon: <FiClipboard size={24} />,
          label: "Submissions Received",
          value: statsData.totalSubmissionsReceived,
          color: "orange",
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-base-content/70 mt-1">
          Here's a summary of your posted challenges.
        </p>
      </div>

      <StatCardGrid stats={clientStats} loading={!statsData} />

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recent Challenges</h2>
          <Link
            href="/client/dashboard/challenges"
            className="btn btn-ghost btn-sm"
          >
            View All
          </Link>
        </div>
        <RecentChallengePreview challenges={recentChallenges} />
      </div>
    </div>
  );
};

export default ClientDashboardPage;
