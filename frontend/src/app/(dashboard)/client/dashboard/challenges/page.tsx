import ClientChallengeList from "@/components/Challenge/ClientChallengeList";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { clientSidebarLinks } from "@/config/dashboard";
import { getMyChallenges } from "@/services/challengeService";

const ClientChallengesPage = async () => {
  const challenges = await getMyChallenges();

  return (
    <DashboardLayout sidebarLinks={clientSidebarLinks}>
      <div className="grid gap-6">
        <h1 className="text-3xl font-bold">My Challenges</h1>
        <ClientChallengeList challenges={challenges} />
      </div>
    </DashboardLayout>
  );
};

export default ClientChallengesPage;
