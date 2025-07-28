import ClientChallengeList from "@/components/Challenge/ClientChallengeList";
import DashboardLayout, {
  DashboardLink,
} from "@/components/Layout/DashboardLayout";
import { BsGrid } from "react-icons/bs";

import { GoPlusCircle } from "react-icons/go";

const clientSidebarLinks: DashboardLink[] = [
  { href: "/client/dashboard", label: "My Challenges", icon: <BsGrid /> },
  {
    href: "/client/dashboard/create",
    label: "Create Challenge",
    icon: <GoPlusCircle />,
  },
];

const ClientDashboardPage = () => {
  return (
    <DashboardLayout sidebarLinks={clientSidebarLinks}>
      <ClientChallengeList />
    </DashboardLayout>
  );
};

export default ClientDashboardPage;
