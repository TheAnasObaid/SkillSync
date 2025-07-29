import DeveloperSubmissionList from "@/components/Developer/DeveloperSubmissionList";
import DashboardLayout, {
  DashboardLink,
} from "@/components/Layout/DashboardLayout";
import { FiUser } from "react-icons/fi";
import { TbBriefcase2 } from "react-icons/tb";

const developerSidebarLinks: DashboardLink[] = [
  {
    href: "/developer/dashboard",
    label: "My Submissions",
    icon: <TbBriefcase2 />,
  },
  {
    href: "/developer/dashboard/profile",
    label: "My Profile",
    icon: <FiUser />,
  },
];

const DeveloperDashboardPage = () => {
  return (
    <DashboardLayout sidebarLinks={developerSidebarLinks}>
      <DeveloperSubmissionList />
    </DashboardLayout>
  );
};

export default DeveloperDashboardPage;
