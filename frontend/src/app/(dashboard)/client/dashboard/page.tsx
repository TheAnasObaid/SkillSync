import ClientChallengeList from "@/components/Challenge/ClientChallengeList";
import StatCardGrid, { StatItem } from "@/components/Common/StatCardGrid";
import { getMyChallenges } from "@/services/server/challengeService";
import { getMyClientStats } from "@/services/server/userService";
import { FiArchive, FiCheckSquare, FiClipboard } from "react-icons/fi";

const ClientDashboardPage = async () => {
  const [statsData, recentChallengesData] = await Promise.all([
    getMyClientStats(),
    getMyChallenges(),
  ]);

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
    <div className="grid gap-6">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-base-content/70">
          Here's a summary of your posted challenges.
        </p>
      </div>
      {statsData && <StatCardGrid stats={clientStats} loading={!statsData} />}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Challenges</h2>
        <ClientChallengeList challenges={recentChallengesData} />
      </div>
    </div>
  );
};

export default ClientDashboardPage;
