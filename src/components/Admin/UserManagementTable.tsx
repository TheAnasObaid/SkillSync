"use client";

import ConfirmationModal from "@/components/Common/ConfirmationModal";
import UserAvatar from "@/components/Profile/UserAvatar";
import { useUpdateUserByAdminMutation } from "@/hooks/mutations/useAdminMutations";
import { useAllUsersQuery } from "@/hooks/queries/useAdminQueries";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { FiMoreVertical, FiSlash } from "react-icons/fi";
import UserActionMenu from "./UserActionMenu";
import UserCard from "./UserCard";
import { User, Role, AccountStatus } from "@prisma/client";

type UserUpdateAction =
  | { role: Role }
  | { isVerified: boolean }
  | { accountStatus: AccountStatus };

const UserManagementTable = () => {
  const { user: currentUser } = useAuthStore();
  const { data: users, isLoading, isError } = useAllUsersQuery();
  const { mutate: updateUser, isPending: isUpdating } =
    useUpdateUserByAdminMutation();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: "error" | "primary";
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  const handleUpdateUser = (userId: string, updates: UserUpdateAction) => {
    const action = Object.keys(updates)[0];
    const value = Object.values(updates)[0];

    setModalState({
      isOpen: true,
      title: `Confirm Action`,
      message: `Are you sure you want to change this user's ${action} to "${value}"?`,
      variant:
        action === "accountStatus" && value === AccountStatus.BANNED
          ? "error"
          : "primary",
      onConfirm: () => {
        updateUser(
          { userId, updates },
          {
            onSuccess: () =>
              setModalState({
                isOpen: false,
                title: "",
                message: "",
                onConfirm: () => {},
              }),
          }
        );
      },
    });
  };

  if (isLoading) return <div className="skeleton h-96 w-full"></div>;
  if (isError || !users)
    return <div className="alert alert-error">Could not load users.</div>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            isCurrentUser={currentUser?.id === user.id}
            onUpdate={handleUpdateUser}
          />
        ))}
      </div>

      <div className="hidden md:block card bg-base-200/50 border border-base-300">
        <table className="table">
          <thead>
            <tr>
              <th className="w-1/3">User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className={`hover ${
                  user.accountStatus === AccountStatus.BANNED
                    ? "bg-error/10"
                    : ""
                }`}
              >
                <td>
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      name={user.firstName}
                      avatarUrl={user.avatarUrl}
                    />
                    <div>
                      <div className="font-bold">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-base-content/40">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-ghost badge-sm capitalize">
                    {user.role.toLowerCase()}
                  </span>
                </td>
                <td>
                  <div className="flex flex-col items-start gap-1">
                    {user.accountStatus === AccountStatus.ACTIVE ? (
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
                      disabled={currentUser?.id === user.id}
                    >
                      {currentUser?.id === user.id ? (
                        <FiSlash />
                      ) : (
                        <FiMoreVertical />
                      )}
                    </button>
                    {currentUser?.id !== user.id && (
                      <UserActionMenu user={user} onUpdate={handleUpdateUser} />
                    )}
                  </div>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        onConfirm={modalState.onConfirm}
        onCancel={() => setModalState({ ...modalState, isOpen: false })}
        variant={modalState.variant}
        isActionInProgress={isUpdating}
      />
    </>
  );
};

export default UserManagementTable;
