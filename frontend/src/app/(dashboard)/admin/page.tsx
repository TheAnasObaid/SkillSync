import StatCard from "@/components/Admin/StatCard";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { adminSidebarLinks } from "@/config/dashboard";
import { getPlatformStats } from "@/services/server/adminService";
import Link from "next/link";
import { FiArchive, FiCheckSquare, FiClipboard, FiUsers } from "react-icons/fi";

const AdminPanelPage = async () => {
  const stats = await getPlatformStats();

  return (
    <DashboardLayout sidebarLinks={adminSidebarLinks}>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        )}

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
    </DashboardLayout>
  );
};

export default AdminPanelPage;
