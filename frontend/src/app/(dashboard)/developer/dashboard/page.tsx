import StatCard from "@/components/Admin/StatCard";
import DeveloperSubmissionList from "@/components/Developer/DeveloperSubmissionList";
import { getMySubmissions } from "@/services/server/submissionService";
import { getMyDeveloperStats } from "@/services/server/userService";
import Link from "next/link";
import { FiAward, FiClipboard, FiClock } from "react-icons/fi";

const DeveloperDashboardPage = async () => {
  const [stats, recentSubmissions] = await Promise.all([
    getMyDeveloperStats(),
    getMySubmissions(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-base-content/70 mt-1">
          Here's a summary of your activity on SkillSync.
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
  );
};

export default DeveloperDashboardPage;
