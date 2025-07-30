"use client";

import DashboardLayout, {
  DashboardLink,
} from "@/components/Layout/DashboardLayout";
import UserAvatar from "@/components/Profile/UserAvatar";
import apiClient from "@/services/apiClient";
import { useAuthStore, User } from "@/store/authStore";
import { useEffect, useState } from "react";
import {
  FiClipboard,
  FiGrid,
  FiMoreVertical,
  FiSlash,
  FiUser,
  FiUsers,
} from "react-icons/fi";

const adminSidebarLinks: DashboardLink[] = [
  { href: "/admin/panel", label: "Dashboard", icon: <FiGrid /> },
  { href: "/admin/users", label: "Manage Users", icon: <FiUsers /> },
  { href: "/admin/submissions", label: "Submissions", icon: <FiClipboard /> },
  { href: "/admin/panel/profile", label: "My Profile", icon: <FiUser /> },
];

const ManageUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user: currentUser } = useAuthStore();

  const fetchUsers = () => {
    apiClient
      .get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => setError("Failed to fetch users"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    if (!confirm(`Are you sure you want to update this user!`)) return;

    try {
      await apiClient.patch(`/admin/users/${userId}`, updates);
      fetchUsers();
    } catch (err) {
      setError("Failed to update user.");
    }
  };

  if (loading)
    return (
      <div className="text-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <DashboardLayout sidebarLinks={adminSidebarLinks}>
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      {error && <div className="alert alert-error my-4">{error}</div>}
      <div className="card bg-base-200/50 border border-base-300">
        <table className="table">
          <thead>
            <tr>
              <th className="w-1/3">User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isCurrentUser = currentUser?._id === user?._id;

              if (user)
                return (
                  <tr key={user._id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={user.profile?.firstName}
                          avatarUrl={user.profile?.avatar}
                        />
                        <div className="overflow-hidden">
                          <div className="font-bold truncate">
                            {user.profile?.firstName} {user.profile?.lastName}
                          </div>
                          <div className="text-sm text-base-content/40 truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-ghost badge-sm">
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col gap-2">
                        {user.accountStatus === "active" ? (
                          <div className="badge badge-xs badge-success badge-soft">
                            Active
                          </div>
                        ) : (
                          <div className="badge badge-xs badge-error badge-soft">
                            Banned
                          </div>
                        )}
                        {user.isVerified ? (
                          <div className="badge badge-xs badge-info badge-soft">
                            Verified
                          </div>
                        ) : (
                          <div className="badge badge-xs badge-warning badge-soft">
                            Not Verified
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>

                    <th>
                      <div className="dropdown dropdown-end">
                        <button
                          tabIndex={0}
                          className="btn btn-ghost btn-xs"
                          disabled={isCurrentUser}
                        >
                          {isCurrentUser ? <FiSlash /> : <FiMoreVertical />}
                        </button>
                        {!isCurrentUser && (
                          <ul
                            tabIndex={0}
                            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                          >
                            {!user.isVerified && (
                              <li>
                                <a
                                  onClick={() =>
                                    handleUpdateUser(user._id, {
                                      isVerified: true,
                                    })
                                  }
                                >
                                  Mark as Verified
                                </a>
                              </li>
                            )}

                            {user.role === "admin" ? (
                              <>
                                <li>
                                  <a
                                    onClick={() =>
                                      handleUpdateUser(user._id, {
                                        role: "developer",
                                      })
                                    }
                                  >
                                    Demote to Developer
                                  </a>
                                </li>
                                <li>
                                  <a
                                    onClick={() =>
                                      handleUpdateUser(user._id, {
                                        role: "client",
                                      })
                                    }
                                  >
                                    Demote to Client
                                  </a>
                                </li>
                              </>
                            ) : (
                              <>
                                <li>
                                  <a
                                    onClick={() =>
                                      handleUpdateUser(user._id, {
                                        role: "admin",
                                      })
                                    }
                                  >
                                    Promote to Admin
                                  </a>
                                </li>
                                {user.role === "client" && (
                                  <li>
                                    <a
                                      onClick={() =>
                                        handleUpdateUser(user._id, {
                                          role: "developer",
                                        })
                                      }
                                    >
                                      Change to Developer
                                    </a>
                                  </li>
                                )}
                                {user.role === "developer" && (
                                  <li>
                                    <a
                                      onClick={() =>
                                        handleUpdateUser(user._id, {
                                          role: "client",
                                        })
                                      }
                                    >
                                      Change to Client
                                    </a>
                                  </li>
                                )}
                              </>
                            )}

                            <div className="divider my-1"></div>
                            {user.accountStatus === "active" ? (
                              <li>
                                <a
                                  className="text-error"
                                  onClick={() =>
                                    handleUpdateUser(user._id, {
                                      accountStatus: "banned",
                                    })
                                  }
                                >
                                  Ban User
                                </a>
                              </li>
                            ) : (
                              <li>
                                <a
                                  className="text-success"
                                  onClick={() =>
                                    handleUpdateUser(user._id, {
                                      accountStatus: "active",
                                    })
                                  }
                                >
                                  Unban User
                                </a>
                              </li>
                            )}
                          </ul>
                        )}
                      </div>
                    </th>
                  </tr>
                );
            })}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsersPage;
