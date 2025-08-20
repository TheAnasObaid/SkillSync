"use client";

import { AccountStatus, Role, User } from "@prisma/client";
import { UserUpdateAction } from "./UserManagementTable";

interface UserActionMenuProps {
  user: User;
  onUpdate: (userId: string, updates: UserUpdateAction) => void;
}

const UserActionMenu = ({ user, onUpdate }: UserActionMenuProps) => {
  return (
    <ul
      tabIndex={0}
      className="menu border font-normal border-base-300 dropdown-content z-[1] p-2 shadow bg-base-200 rounded-box w-52"
    >
      {!user.emailVerified && (
        <li>
          <a onClick={() => onUpdate(user.id, { setVerified: true })}>
            Mark as Verified
          </a>
        </li>
      )}

      {user.role === Role.ADMIN ? (
        <>
          <li>
            <a onClick={() => onUpdate(user.id, { role: Role.DEVELOPER })}>
              Demote to Developer
            </a>
          </li>
          <li>
            <a onClick={() => onUpdate(user.id, { role: Role.CLIENT })}>
              Demote to Client
            </a>
          </li>
        </>
      ) : (
        <>
          <li>
            <a onClick={() => onUpdate(user.id, { role: Role.ADMIN })}>
              Promote to Admin
            </a>
          </li>
          {user.role === Role.CLIENT && (
            <li>
              <a onClick={() => onUpdate(user.id, { role: Role.DEVELOPER })}>
                Change to Developer
              </a>
            </li>
          )}
          {user.role === Role.DEVELOPER && (
            <li>
              <a onClick={() => onUpdate(user.id, { role: Role.CLIENT })}>
                Change to Client
              </a>
            </li>
          )}
        </>
      )}

      <div className="divider my-1"></div>

      {user.accountStatus === AccountStatus.ACTIVE ? (
        <li>
          <a
            className="text-error"
            onClick={() =>
              onUpdate(user.id, { accountStatus: AccountStatus.BANNED })
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
              onUpdate(user.id, { accountStatus: AccountStatus.ACTIVE })
            }
          >
            Unban User
          </a>
        </li>
      )}
    </ul>
  );
};

export default UserActionMenu;
