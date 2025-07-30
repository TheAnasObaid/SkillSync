"use client";

import DashboardLayout, {
  DashboardLink,
} from "@/components/Layout/DashboardLayout";
import UserAvatar from "@/components/Profile/UserAvatar";
import apiClient from "@/services/apiClient";
import { User } from "@/store/authStore";
import { useEffect, useState } from "react";
import { FiGrid, FiUsers, FiClipboard, FiUser } from "react-icons/fi";

const adminSidebarLinks: DashboardLink[] = [
  { href: "/admin/panel", label: "Dashboard", icon: <FiGrid /> },
  { href: "/admin/users", label: "Manage Users", icon: <FiUsers /> },
  { href: "/admin/submissions", label: "Submissions", icon: <FiClipboard /> },
  { href: "/admin/panel/profile", label: "My Profile", icon: <FiUser /> },
];

const ManageUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to fetch users", err))
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
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      {users.length > 0 ? (
        <div className="card bg-base-200/50 border border-base-300">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Verified</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user?._id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={user?.profile?.firstName}
                          avatarUrl={user?.profile?.avatar}
                        />
                        <div>
                          <div className="font-bold">
                            {user?.profile?.firstName} {user?.profile?.lastName}
                          </div>
                          <div className="text-sm opacity-50">
                            {user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-soft badge-sm">
                        {user?.role}
                      </span>
                    </td>
                    <td>
                      {user?.isVerified ? (
                        <span className="badge badge-success badge-soft">
                          Yes
                        </span>
                      ) : (
                        <span className="badge badge-error badge-soft">No</span>
                      )}
                    </td>
                    <td>{new Date(user!.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>We currently don't have any users on our platform</p>
      )}
    </DashboardLayout>
  );
};

export default ManageUsersPage;
