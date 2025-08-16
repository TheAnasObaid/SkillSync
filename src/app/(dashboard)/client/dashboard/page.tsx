import RecentChallengePreview from "@/components/Client/RecentChallengePreview";
import StatCardGrid, { StatItem } from "@/components/Common/StatCardGrid";
import { getMyChallenges } from "@/lib/data/challenges";
import { getMyClientStats } from "@/lib/data/users";
import Link from "next/link";
import { Suspense } from "react";
import { FiArchive, FiCheckSquare, FiClipboard } from "react-icons/fi";

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
          link: "/client/dashboard/challenges",
        },
        {
          icon: <FiClipboard size={24} />,
          label: "Submissions Received",
          value: statsData.totalSubmissionsReceived,
          color: "orange",
          link: "/client/dashboard/challenges",
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

      <Suspense fallback={<StatCardGridSkeleton />}>
        <StatCardGrid stats={clientStats} />
      </Suspense>

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
        <Suspense fallback={<RecentChallengeSkeleton />}>
          <RecentChallengePreview challenges={recentChallenges} />
        </Suspense>
      </div>
    </div>
  );
};

const StatCardGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div className="skeleton h-40 w-full"></div>
    <div className="skeleton h-40 w-full"></div>
    <div className="skeleton h-40 w-full"></div>
  </div>
);

const RecentChallengeSkeleton = () => (
  <div className="space-y-3">
    <div className="skeleton h-20 w-full"></div>
    <div className="skeleton h-20 w-full"></div>
    <div className="skeleton h-20 w-full"></div>
  </div>
);

export default ClientDashboardPage;
