import ClientChallengeList from "@/components/Challenge/ClientChallengeList";
import ClientStatsCard from "@/components/Client/ClientStatsCard";
import { getMyChallenges } from "@/services/server/challengeService";
import { getMyClientStats } from "@/services/server/userService";

const ClientDashboardPage = async () => {
  const [stats, recentChallengesData] = await Promise.all([
    getMyClientStats(),
    getMyChallenges(),
  ]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-base-content/70">
          Here's a summary of your posted challenges.
        </p>
      </div>
      {stats && <ClientStatsCard stats={stats} />}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Challenges</h2>
        <ClientChallengeList challenges={recentChallengesData} />
      </div>
    </div>
  );
};

export default ClientDashboardPage;
