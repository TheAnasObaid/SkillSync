import StatCardGrid, { StatItem } from "@/components/Common/StatCardGrid";
import DeveloperSubmissionList from "@/components/Developer/DeveloperSubmissionList";
import { getMyDeveloperStats, getMyProfile } from "@/lib/data/users";
import Link from "next/link";
import { Suspense } from "react";
import { FiAward, FiClipboard, FiClock, FiDollarSign } from "react-icons/fi";

const DeveloperDashboardPage = async () => {
  const [statsData, userProfile] = await Promise.all([
    getMyDeveloperStats(),
    getMyProfile(),
  ]);

  const allSubmissions = userProfile?.submissions || [];
  const recentSubmissions = allSubmissions.slice(0, 3);

  const developerStats: StatItem[] =
    statsData && userProfile
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
          {
            icon: <FiDollarSign size={24} />,
            label: "Total Earnings",
            value: `$${(userProfile.earnings || 0).toLocaleString()}`,
            color: "green",
          },
        ]
      : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {userProfile?.firstName}!
        </h1>
        <p className="text-base-content/70 mt-1">
          Here's a summary of your activity on SkillSync.
        </p>
      </div>

      <Suspense fallback={<StatCardGridSkeleton />}>
        <StatCardGrid stats={developerStats} />
      </Suspense>

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

        <DeveloperSubmissionList initialSubmissions={recentSubmissions} />
      </div>
    </div>
  );
};

const StatCardGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div className="skeleton h-40 w-full"></div>
    <div className="skeleton h-40 w-full"></div>
    <div className="skeleton h-40 w-full"></div>
    <div className="skeleton h-40 w-full"></div>
  </div>
);

export default DeveloperDashboardPage;
