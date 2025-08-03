import StatCardGrid, { StatItem } from "@/components/Common/StatCardGrid";
import { getPlatformStats } from "@/services/server/adminService";
import Link from "next/link";
import { FiArchive, FiCheckSquare, FiClipboard, FiUsers } from "react-icons/fi";

const AdminPanelPage = async () => {
  const statsData = await getPlatformStats();

  const adminStats: StatItem[] = statsData
    ? [
        {
          icon: <FiUsers size={24} />,
          label: "Total Users",
          value: statsData.totalUsers,
          color: "green",
          link: "/admin/users",
        },
        {
          icon: <FiArchive size={24} />,
          label: "Total Challenges",
          value: statsData.totalChallenges,
          color: "orange",
          link: "/challenges",
        },
        {
          icon: <FiCheckSquare size={24} />,
          label: "Completed",
          value: statsData.completedChallenges,
          color: "blue",
          link: "/challenges",
        },
        {
          icon: <FiClipboard size={24} />,
          label: "Pending Submissions",
          value: statsData.pendingSubmissions,
          color: "red",
          link: "/admin/submissions",
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      {statsData && <StatCardGrid stats={adminStats} loading={!statsData} />}
      <div className="card bg-base-200/50 border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-2xl">Management Actions</h2>
          <div className="divider my-2"></div>
          <div className="card-actions justify-start">
            <Link href="/admin/submissions" className="btn btn-primary">
              <FiClipboard /> Review All Submissions
            </Link>
            <Link href="/admin/users" className="btn btn-secondary">
              <FiUsers /> Manage All Users
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
