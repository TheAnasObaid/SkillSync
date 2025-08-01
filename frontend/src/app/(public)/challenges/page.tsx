import ChallengeList from "@/components/Challenge/ChallengeList";
import { getAllChallenges } from "@/services/server/challengeService";

const Challenges = async () => {
  const challenges = await getAllChallenges();

  return (
    <div className="py-10">
      <div className="space-y-5 text-center">
        <h1 className="text-4xl font-bold">Open Challenges</h1>
        <p className="text-base-content/70 max-w-xl mx-auto">
          Browse the list of challenges posted by our clients. Find a project
          that matches your skills and submit your solution to win prizes and
          build your reputation.
        </p>
      </div>
      <div className="mt-12">
        <ChallengeList challenges={challenges} />
      </div>
    </div>
  );
};

export default Challenges;
