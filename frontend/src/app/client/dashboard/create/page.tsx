import ChallengeForm from "@/components/Challenge/ChallengeForm";
import DashboardLayout, {
  DashboardLink,
} from "@/components/Layout/DashboardLayout";

import { FiGrid, FiPlusSquare } from "react-icons/fi";

const clientSidebarLinks: DashboardLink[] = [
  { href: "/client/dashboard", label: "My Challenges", icon: <FiGrid /> },
  {
    href: "/client/dashboard/create",
    label: "Create Challenge",
    icon: <FiPlusSquare />,
  },
];

const CreateChallengePage = () => {
  return (
    <DashboardLayout sidebarLinks={clientSidebarLinks}>
      <div>
        <h2 className="text-3xl font-bold mb-6">Create a New Challenge</h2>
        <ChallengeForm />
      </div>
    </DashboardLayout>
  );
};

export default CreateChallengePage;
