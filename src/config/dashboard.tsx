import { BsGrid } from "react-icons/bs";
import {
  FiArchive,
  FiClipboard,
  FiGrid,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { GoPlusCircle } from "react-icons/go";
import { TbBriefcase2 } from "react-icons/tb";

export type DashboardLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export const clientSidebarLinks: DashboardLink[] = [
  { href: "/client/dashboard", label: "Dashboard", icon: <BsGrid /> },
  {
    href: "/client/dashboard/challenges",
    label: "My Challenges",
    icon: <FiArchive />,
  },
  {
    href: "/client/dashboard/create",
    label: "Create Challenge",
    icon: <GoPlusCircle />,
  },
  { href: "/client/dashboard/profile", label: "My Profile", icon: <FiUser /> },
];

export const developerSidebarLinks: DashboardLink[] = [
  { href: "/developer/dashboard", label: "Dashboard", icon: <FiClipboard /> },
  {
    href: "/developer/dashboard/submissions",
    label: "My Submissions",
    icon: <TbBriefcase2 />,
  },
  {
    href: "/challenges",
    label: "Find Challenge",
    icon: <FiArchive />,
  },
  {
    href: "/developer/dashboard/profile",
    label: "My Profile",
    icon: <FiUser />,
  },
];

export const adminSidebarLinks: DashboardLink[] = [
  { href: "/admin", label: "Dashboard", icon: <FiGrid /> },
  { href: "/admin/users", label: "Manage Users", icon: <FiUsers /> },
  { href: "/admin/submissions", label: "Submissions", icon: <FiClipboard /> },
  { href: "/admin/profile", label: "My Profile", icon: <FiUser /> },
];
