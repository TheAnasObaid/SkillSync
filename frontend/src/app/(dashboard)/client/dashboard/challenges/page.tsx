import ClientChallengeList from "@/components/Challenge/ClientChallengeList";
import { getMyChallenges } from "@/services/server/challengeService";

const ClientChallengesPage = async () => {
  const challenges = await getMyChallenges();

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">My Challenges</h1>
      <ClientChallengeList initialChallenges={challenges} />
    </div>
  );
};

export default ClientChallengesPage;
