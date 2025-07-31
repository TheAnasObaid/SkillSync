import StatCard from "@/components/Admin/StatCard";
import ClientChallengeList from "@/components/Challenge/ClientChallengeList";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { clientSidebarLinks } from "@/config/dashboard";
import { getServerApi } from "@/lib/serverApi";
import { IChallenge } from "@/types";
import { FiArchive, FiCheckSquare, FiClipboard } from "react-icons/fi";

interface ClientStats {
  totalChallengesPosted: number;
  activeChallenges: number;
  totalSubmissionsReceived: number;
}

const ClientDashboardPage = async () => {
  const serverApi = await getServerApi();
  let stats: ClientStats | null = null;
  let recentChallenges: IChallenge[] = [];
  let error: string | null = null;

  try {
    // We can fetch multiple data points in parallel for better performance
    const [statsResponse, challengesResponse] = await Promise.all([
      serverApi.get("/users/me/stats/client"),
      serverApi.get("/challenges/me"),
    ]);
    stats = statsResponse.data;

    recentChallenges = challengesResponse.data.slice(0, 5);
  } catch (err) {
    console.error("Failed to fetch client dashboard data:", err);
    error = "Could not load your dashboard. Please try again later.";
  }

  return (
    <DashboardLayout sidebarLinks={clientSidebarLinks}>
      <div className="space-y-8">
        <div>
          {/* We can get the user's name on the server in a future step, for now, a generic welcome */}
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-base-content/70 mt-1">
            Here's a summary of your posted challenges.
          </p>
        </div>

        {/* Conditionally render the error, the stats, or a fallback */}
        {error ? (
          <div className="alert alert-error">{error}</div>
        ) : stats ? (
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
        ) : (
          <p>Could not load stats.</p>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recent Challenges</h2>
          {/* 
            Pass the server-fetched `recentChallenges` data as a prop
            to the ClientChallengeList, which we already refactored into
            a "dumb" presentational component.
          */}
          <ClientChallengeList challenges={recentChallenges} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboardPage;
