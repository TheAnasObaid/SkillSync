"use client";

import { IUser } from "@/types";

type UserUpdateAction =
  | { role: "developer" | "client" | "admin" }
  | { isVerified: boolean }
  | { accountStatus: "active" | "banned" };

interface UserActionMenuProps {
  user: IUser;
  onUpdate: (userId: string, updates: UserUpdateAction) => void;
}

const UserActionMenu = ({ user, onUpdate }: UserActionMenuProps) => {
  return (
    <ul
      tabIndex={0}
      className="menu border font-normal border-base-300 dropdown-content z-[1] p-2 shadow bg-base-200 rounded-box w-52"
    >
      {!user.isVerified && (
        <li>
          <a onClick={() => onUpdate(user._id, { isVerified: true })}>
            Mark as Verified
          </a>
        </li>
      )}

      {user.role === "admin" ? (
        <>
          <li>
            <a onClick={() => onUpdate(user._id, { role: "developer" })}>
              Demote to Developer
            </a>
          </li>
          <li>
            <a onClick={() => onUpdate(user._id, { role: "client" })}>
              Demote to Client
            </a>
          </li>
        </>
      ) : (
        <>
          <li>
            <a onClick={() => onUpdate(user._id, { role: "admin" })}>
              Promote to Admin
            </a>
          </li>
          {user.role === "client" && (
            <li>
              <a onClick={() => onUpdate(user._id, { role: "developer" })}>
                Change to Developer
              </a>
            </li>
          )}
          {user.role === "developer" && (
            <li>
              <a onClick={() => onUpdate(user._id, { role: "client" })}>
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
            onClick={() => onUpdate(user._id, { accountStatus: "banned" })}
          >
            Ban User
          </a>
        </li>
      ) : (
        <li>
          <a
            className="text-success"
            onClick={() => onUpdate(user._id, { accountStatus: "active" })}
          >
            Unban User
          </a>
        </li>
      )}
    </ul>
  );
};

export default UserActionMenu;
