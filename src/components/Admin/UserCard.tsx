"use client";

import { IUser } from "@/types";
import { FiMoreVertical, FiSlash } from "react-icons/fi";
import UserActionMenu from "./UserActionMenu";
import UserAvatar from "../Profile/UserAvatar";

interface UserCardProps {
  user: IUser;
  isCurrentUser: boolean;
  onUpdate: (userId: string, updates: any) => void;
}

const UserCard = ({ user, isCurrentUser, onUpdate }: UserCardProps) => {
  return (
    <div
      className={`card bg-base-200/50 border border-base-300 ${
        user.accountStatus === "banned" ? "bg-error/10" : ""
      }`}
    >
      <div className="card-body p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <UserAvatar
              name={user.profile?.firstName}
              avatarUrl={user.profile?.avatar}
            />
            <div>
              <p className="font-bold">
                {user.profile?.firstName} {user.profile?.lastName}
              </p>
              <p className="text-xs text-base-content/60">{user.email}</p>
            </div>
          </div>

          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-sm btn-circle"
              disabled={isCurrentUser}
            >
              {isCurrentUser ? <FiSlash /> : <FiMoreVertical />}
            </button>
            {!isCurrentUser && (
              <UserActionMenu user={user} onUpdate={onUpdate} />
            )}
          </div>
        </div>

        <div className="divider my-2"></div>

        <div className="flex justify-between items-center">
          <span className="badge badge-ghost">{user.role}</span>
          <div className="flex items-center gap-2">
            {user.accountStatus === "active" ? (
              <div className="badge badge-success badge-soft">Active</div>
            ) : (
              <div className="badge badge-error badge-soft">Banned</div>
            )}
            {user.isVerified ? (
              <div className="badge badge-info badge-soft">Verified</div>
            ) : (
              <div className="badge badge-warning badge-soft">Not Verified</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
