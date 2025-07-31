import { ReactNode } from "react";
import { BsGrid } from "react-icons/bs";
import { FiArchive, FiUser } from "react-icons/fi";
import { GoPlusCircle } from "react-icons/go";

export interface DashboardLink {
  href: string;
  label: string;
  icon?: ReactNode;
}

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

// You can add developerSidebarLinks and adminSidebarLinks here as well.
