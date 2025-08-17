import { getAllPublicChallenges } from "@/lib/data/challenges";
import ChallengeCard from "./ChallengeCard";

const ChallengeList = async () => {
  const challenges = await getAllPublicChallenges();

  if (!challenges || challenges.length === 0) {
    return (
      <p className="text-center text-base-content/70">
        No challenges available at the moment.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8">
      {challenges.map((challenge) => (
        <ChallengeCard key={challenge.id} challenge={challenge} />
      ))}
    </div>
  );
};

export default ChallengeList;
