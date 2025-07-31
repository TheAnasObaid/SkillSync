"use client";
import DashboardLayout, {
  DashboardLink,
} from "@/components/Layout/DashboardLayout";
import apiClient from "@/lib/apiClient";
import { useEffect, useState } from "react";
import { FiClipboard, FiGrid, FiUser, FiUsers } from "react-icons/fi";

interface AdminSubmission {
  _id: string;
  status: string;
  createdAt: string;
  developerId: {
    profile: { firstName: string };
    email: string;
  };
  challengeId: {
    title: string;
  };
}
const adminSidebarLinks: DashboardLink[] = [
  { href: "/admin/panel", label: "Dashboard", icon: <FiGrid /> },
  { href: "/admin/users", label: "Manage Users", icon: <FiUsers /> },
  { href: "/admin/submissions", label: "Submissions", icon: <FiClipboard /> },
  { href: "/admin/panel/profile", label: "My Profile", icon: <FiUser /> },
];
const AdminSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/admin/submissions")
      .then((res) => setSubmissions(res.data))
      .catch((err) => console.error("Failed to fetch submissions", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="text-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <DashboardLayout sidebarLinks={adminSidebarLinks}>
      <h1 className="text-3xl font-bold mb-6">All Platform Submissions</h1>
      <div className="card bg-base-200/50 border border-base-300">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Developer</th>
                <th>Challenge</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub._id} className="hover">
                  <td>
                    <div className="font-bold">
                      {sub.developerId.profile.firstName}
                    </div>
                    <div className="text-sm opacity-50">
                      {sub.developerId.email}
                    </div>
                  </td>
                  <td>{sub.challengeId.title}</td>
                  <td>
                    <span className="badge badge-ghost badge-sm">
                      {sub.status}
                    </span>
                  </td>
                  <td>{new Date(sub.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSubmissionsPage;
