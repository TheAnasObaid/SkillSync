import StatCard from "@/components/Admin/StatCard";
import ClientChallengeList from "@/components/Challenge/ClientChallengeList";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { clientSidebarLinks } from "@/config/dashboard";
import { getMyChallenges } from "@/services/server/challengeService";
import { getMyClientStats } from "@/services/server/userService";
import { FiArchive, FiCheckSquare, FiClipboard } from "react-icons/fi";

const ClientDashboardPage = async () => {
  const [stats, recentChallengesData] = await Promise.all([
    getMyClientStats(),
    getMyChallenges(),
  ]);

  return (
    <DashboardLayout sidebarLinks={clientSidebarLinks}>
      <div className="grid gap-6">
        <div className="grid gap-1">
          {/* We can get the user's name on the server in a future step, for now, a generic welcome */}
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-base-content/70">
            Here's a summary of your posted challenges.
          </p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        )}

        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Challenges</h2>
          <ClientChallengeList challenges={recentChallengesData} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboardPage;
