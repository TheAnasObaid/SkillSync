import DeveloperStatCard from "@/components/Developer/DeveloperStatCard";
import DeveloperSubmissionList from "@/components/Developer/DeveloperSubmissionList";
import { getMySubmissions } from "@/services/server/submissionService";
import { getMyDeveloperStats } from "@/services/server/userService";
import Link from "next/link";

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
      {stats && <DeveloperStatCard stats={stats} />}
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
