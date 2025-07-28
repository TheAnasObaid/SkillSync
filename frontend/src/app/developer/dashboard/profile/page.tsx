import DashboardLayout, {
  DashboardLink,
} from "@/components/Layout/DashboardLayout";
import { FiBriefcase, FiUser } from "react-icons/fi";

const developerSidebarLinks: DashboardLink[] = [
  {
    href: "/developer/dashboard",
    label: "My Submissions",
    icon: <FiBriefcase />,
  },
  {
    href: "/developer/dashboard/profile",
    label: "My Profile",
    icon: <FiUser />,
  },
];

const DeveloperProfilePage = () => {
  return (
    <DashboardLayout sidebarLinks={developerSidebarLinks}>
      <div>
        <h2 className="text-3xl font-bold mb-6">My Profile</h2>
        <p>This is where your profile editing form will go.</p>
      </div>
    </DashboardLayout>
  );
};

export default DeveloperProfilePage;
