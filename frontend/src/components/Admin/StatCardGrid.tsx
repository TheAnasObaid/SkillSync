import { FiArchive, FiCheckSquare, FiClipboard, FiUsers } from "react-icons/fi";
import { PlatformStats } from "@/types";
import AdminStatCard from "./AdminStatCard";

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
        icon={<FiUsers size={24} />}
        label="Total Users"
        value={stats.totalUsers}
        color="green"
        link="/admin/users"
        linkText="Manage users"
      />
      <AdminStatCard
        icon={<FiArchive size={24} />}
        label="Total Challenges"
        link="/challenges"
        linkText="View challenges"
        value={stats.totalChallenges}
        color="blue"
      />
      <AdminStatCard
        icon={<FiCheckSquare size={24} />}
        label="Completed"
        link="/challenges"
        linkText="View challenges"
        value={stats.completedChallenges}
        color="orange"
      />
      <AdminStatCard
        icon={<FiClipboard size={24} />}
        label="Pending Submissions"
        value={stats.pendingSubmissions}
        color="red"
        link="/admin/submissions"
        linkText="Review submissions"
      />
    </div>
  );
};

export default StatCardGrid;
