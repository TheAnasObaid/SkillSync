import ChallengeForm from "@/components/Challenge/ChallengeForm";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { clientSidebarLinks } from "@/config/dashboard";

const CreateChallengePage = () => {
  return (
    <DashboardLayout sidebarLinks={clientSidebarLinks}>
      <div className="grid gap-6">
        <h2 className="text-3xl font-bold">Create a New Challenge</h2>
        <ChallengeForm />
      </div>
    </DashboardLayout>
  );
};

export default CreateChallengePage;
