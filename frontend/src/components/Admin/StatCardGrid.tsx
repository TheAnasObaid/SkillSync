import { FiArchive, FiCheckSquare, FiClipboard, FiUsers } from "react-icons/fi";
import StatCard from "./StatCard";
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
      <StatCard
        icon={<FiUsers size={32} />}
        label="Total Users"
        value={stats.totalUsers}
      />
      <StatCard
        icon={<FiArchive size={32} />}
        label="Total Challenges"
        value={stats.totalChallenges}
      />
      <StatCard
        icon={<FiCheckSquare size={32} />}
        label="Completed Challenges"
        value={stats.completedChallenges}
      />
      <StatCard
        icon={<FiClipboard size={32} />}
        label="Pending Submissions"
        value={stats.pendingSubmissions}
      />
    </div>
  );
};

export default StatCardGrid;
