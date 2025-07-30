"use client";
import ClientChallengeList from "@/components/Challenge/ClientChallengeList";
import DashboardLayout, {
  DashboardLink,
} from "@/components/Layout/DashboardLayout";
import { BsGrid } from "react-icons/bs";
import { FiArchive, FiUser } from "react-icons/fi";
import { GoPlusCircle } from "react-icons/go";

const clientSidebarLinks: DashboardLink[] = [
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

const ClientChallengesPage = () => {
  return (
    <DashboardLayout sidebarLinks={clientSidebarLinks}>
      <ClientChallengeList />
    </DashboardLayout>
  );
};
export default ClientChallengesPage;
