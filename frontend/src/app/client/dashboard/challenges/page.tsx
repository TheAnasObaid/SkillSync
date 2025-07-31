import ClientChallengeList from "@/components/Challenge/ClientChallengeList";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { clientSidebarLinks } from "@/config/dashboard";
import { getServerApi } from "@/lib/serverApi";
import { IChallenge } from "@/types";

const ClientChallengesPage = async () => {
  let error: string | null = null;

  const serverApi = await getServerApi();
  const response = await serverApi.get("/challenges/me");
  const challenges: IChallenge[] = response.data;

  return (
    <DashboardLayout sidebarLinks={clientSidebarLinks}>
      <h1 className="text-3xl font-bold mb-6">My Challenges</h1>
      {error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <ClientChallengeList challenges={challenges} />
      )}
    </DashboardLayout>
  );
};

export default ClientChallengesPage;
