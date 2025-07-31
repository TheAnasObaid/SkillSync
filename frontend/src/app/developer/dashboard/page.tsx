import StatCard from "@/components/Admin/StatCard";
import DeveloperSubmissionList from "@/components/Developer/DeveloperSubmissionList";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { FiAward, FiClipboard, FiClock } from "react-icons/fi";

interface DeveloperStats {
  totalSubmissions: number;
  winningSubmissions: number;
  pendingReviews: number;
}

import { developerSidebarLinks } from "@/config/dashboard";
import { getServerApi } from "@/lib/serverApi";
import { ISubmission } from "@/types";
import Link from "next/link";

interface DeveloperStats {
  totalSubmissions: number;
  winningSubmissions: number;
  pendingReviews: number;
}

const DeveloperDashboardPage = async () => {
  const serverApi = await getServerApi();
  let stats: DeveloperStats | null = null;
  let recentSubmissions: ISubmission[] = [];
  let error: string | null = null;

  try {
    const [statsResponse, submissionsResponse] = await Promise.all([
      serverApi.get("/users/me/stats/developer"),
      serverApi.get("/submissions/me"),
    ]);
    stats = statsResponse.data;
    recentSubmissions = submissionsResponse.data.slice(0, 3);
  } catch (err) {
    console.error("Failed to fetch developer dashboard data:", err);
    error = "Could not load your dashboard. Please try again later.";
  }

  return (
    <DashboardLayout sidebarLinks={developerSidebarLinks}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-base-content/70 mt-1">
            Here's a summary of your activity on SkillSync.
          </p>
        </div>

        {error ? (
          <div className="alert alert-error">{error}</div>
        ) : stats ? (
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
        ) : (
          <p>Could not load stats.</p>
        )}

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Submissions</h2>
            <Link
              href="/developer/dashboard/submissions"
              className="btn btn-ghost btn-sm"
            >
              View All
            </Link>
          </div>
          <DeveloperSubmissionList submissions={recentSubmissions} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DeveloperDashboardPage;
