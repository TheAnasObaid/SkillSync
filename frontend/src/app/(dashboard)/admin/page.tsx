import StatCardGrid from "@/components/Admin/StatCardGrid";
import Link from "next/link";
import { FiClipboard, FiUsers } from "react-icons/fi";

const AdminPanelPage = async () => {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      <StatCardGrid />
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
