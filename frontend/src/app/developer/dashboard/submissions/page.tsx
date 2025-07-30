"use client";

import DeveloperSubmissionList from "@/components/Developer/DeveloperSubmissionList";
import DashboardLayout, {
  DashboardLink,
} from "@/components/Layout/DashboardLayout";
import { FiClipboard, FiUser } from "react-icons/fi";
import { TbBriefcase2 } from "react-icons/tb";

const developerSidebarLinks: DashboardLink[] = [
  { href: "/developer/dashboard", label: "Dashboard", icon: <FiClipboard /> },
  {
    href: "/developer/dashboard/submissions",
    label: "My Submissions",
    icon: <TbBriefcase2 />,
  },
  {
    href: "/developer/dashboard/profile",
    label: "My Profile",
    icon: <FiUser />,
  },
];

const SubmissionsPage = () => {
  return (
    <DashboardLayout sidebarLinks={developerSidebarLinks}>
      <DeveloperSubmissionList />
    </DashboardLayout>
  );
};

export default SubmissionsPage;
