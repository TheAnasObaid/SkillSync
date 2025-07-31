"use client";

import ConfirmationModal from "@/components/Common/ConfirmationModal";
import UserAvatar from "@/components/Profile/UserAvatar";
import apiClient from "@/lib/apiClient";
import { getAllUsersClient } from "@/services/client/adminService";
import { useAuthStore } from "@/store/authStore";
import { IUser } from "@/types";
import { useState } from "react";
import { FiMoreVertical, FiSlash } from "react-icons/fi";

type UserUpdateAction =
  | { role: "developer" | "client" | "admin" }
  | { isVerified: boolean }
  | { accountStatus: "active" | "banned" };

interface UserManagementTableProps {
  initialUsers: IUser[];
}

const UserManagementTable = ({ initialUsers }: UserManagementTableProps) => {
  const [users, setUsers] = useState<IUser[]>(initialUsers);
  const { user: currentUser } = useAuthStore();
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
    confirmButtonClass?: string;
  }>({ isOpen: false, title: "", message: "" });

  const handleUpdateUser = (userId: string, updates: UserUpdateAction) => {
    const actionKeys = Object.keys(updates) as Array<keyof UserUpdateAction>;
    if (actionKeys.length === 0) {
      console.error("Update action was called with an empty object.");
      return;
    }

    const action = Object.keys(updates)[0]; // e.g., 'role', 'isVerified', 'accountStatus'
    const value = Object.values(updates)[0];

    setModalState({
      isOpen: true,
      title: `Confirm Action`,
      message: `Are you sure you want to change this user's ${action} to "${value}"?`,
      confirmButtonClass:
        action === "accountStatus" && value === "banned"
          ? "btn-error"
          : "btn-primary",
      onConfirm: async () => {
        setIsUpdating(true);
        try {
          await apiClient.patch(`/admin/users/${userId}`, updates);
          fetchUsers();
        } catch (err) {
          setError("Failed to update user.");
        } finally {
          setIsUpdating(false);
          setModalState({ isOpen: false, title: "", message: "" });
        }
      },
    });
  };

  const handleCancel = () => {
    setModalState({ isOpen: false, title: "", message: "" });
  };

  const fetchUsers = async () => {
    const users = await getAllUsersClient();
    setUsers(users);
  };

  return (
    <>
      {error && <div className="alert alert-error my-4">{error}</div>}
      <div className="card bg-base-200/50 border border-base-300">
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
      </div>
      <ConfirmationModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        onConfirm={modalState.onConfirm!}
        onCancel={handleCancel}
        confirmButtonClass={modalState.confirmButtonClass}
        isActionInProgress={isUpdating}
      />
    </>
  );
};

export default UserManagementTable;
