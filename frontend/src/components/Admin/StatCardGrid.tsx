import { FiArchive, FiCheckSquare, FiClipboard, FiUsers } from "react-icons/fi";
import AdminStatCard from "./StatCard";
import { PlatformStats } from "@/types";

interface Props {
  stats: PlatformStats | null;
}

const StatCardGrid = async ({ stats }: Props) => {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="skeleton h-28 w-full"></div>
        <div className="skeleton h-28 w-full"></div>
        <div className="skeleton h-28 w-full"></div>
        <div className="skeleton h-28 w-full"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <AdminStatCard
        icon={<FiUsers size={32} />}
        label="Total Users"
        value={stats.totalUsers}
      />
      <AdminStatCard
        icon={<FiArchive size={32} />}
        label="Total Challenges"
        value={stats.totalChallenges}
      />
      <AdminStatCard
        icon={<FiCheckSquare size={32} />}
        label="Completed Challenges"
        value={stats.completedChallenges}
      />
      <AdminStatCard
        icon={<FiClipboard size={32} />}
        label="Pending Submissions"
        value={stats.pendingSubmissions}
      />
    </div>
  );
};

export default StatCardGrid;
