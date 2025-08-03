import StatCardGrid, { StatItem } from "@/components/Common/StatCardGrid";
import DeveloperSubmissionList from "@/components/Developer/DeveloperSubmissionList";
import { getMySubmissions } from "@/services/server/submissionService";
import { getMyDeveloperStats } from "@/services/server/userService";
import Link from "next/link";
import { FiAward, FiClipboard, FiClock } from "react-icons/fi";

const DeveloperDashboardPage = async () => {
  const [statsData, recentSubmissions] = await Promise.all([
    getMyDeveloperStats(),
    getMySubmissions(),
  ]);

  const developerStats: StatItem[] = statsData
    ? [
        {
          icon: <FiClipboard size={24} />,
          label: "Total Submissions",
          value: statsData.totalSubmissions,
          color: "green",
          link: "/developer/dashboard/submissions",
        },
        {
          icon: <FiAward size={24} />,
          label: "Challenges Won",
          value: statsData.winningSubmissions,
          color: "blue",
          link: "/developer/dashboard/submissions",
        },
        {
          icon: <FiClock size={24} />,
          label: "Pending Reviews",
          value: statsData.pendingReviews,
          color: "orange",
          link: "/developer/dashboard/submissions",
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-base-content/70 mt-1">
          Here's a summary of your activity on SkillSync.
        </p>
      </div>
      {statsData && (
        <StatCardGrid stats={developerStats} loading={!statsData} />
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
