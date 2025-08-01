import { getDashboardPath } from "@/lib/helper";
import { IUser } from "@/types";
import Link from "next/link";
import UserAvatar from "../Profile/UserAvatar";

interface Props {
  user: IUser;
  dashboardHref: string;
  onModalOpen: (isOpen: boolean) => void;
}

const ProfileDropdown = ({ user, dashboardHref, onModalOpen }: Props) => {
  return (
    <div className="dropdown dropdown-end">
      <button tabIndex={0} className="btn btn-ghost btn-circle">
        <UserAvatar
          name={user.profile?.firstName}
          avatarUrl={user.profile?.avatar}
        />
      </button>
      <ul
        tabIndex={0}
        className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52"
      >
        <li>
          <p className="justify-between font-semibold">
            {user.profile?.firstName}
            <span className="badge badge-primary badge-soft badge-sm">
              {user.role}
            </span>
          </p>
        </li>
        <div className="divider my-1"></div>
        <li>
          <Link href={dashboardHref}>Dashboard</Link>
        </li>
        <li>
          <Link href={`${getDashboardPath(user.role)}/profile`}>Profile</Link>
        </li>
        <div className="divider my-1"></div>
        <li>
          <button
            className="btn btn-error btn-soft"
            onClick={() => onModalOpen(true)}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;
