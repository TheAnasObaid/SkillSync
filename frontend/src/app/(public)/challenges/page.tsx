import ClientChallengeList from "@/components/Challenge/ClientChallengeList";
import { getAllChallenges } from "@/services/challengeService";

const Challenges = async () => {
  const challenges = await getAllChallenges();

  return (
    <div className="h-screen grid max-w-5xl py-5 w-full mx-auto">
      <div className="grid gap-5">
        <h1 className="text-3xl text-center font-bold">Open Challenges</h1>
        <ClientChallengeList challenges={challenges} />
      </div>
    </div>
  );
};

export default Challenges;
