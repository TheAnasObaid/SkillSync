import { getAllChallenges } from "@/lib/data/challenges";
import { IChallenge } from "@/types";
import EmptyState from "../Common/EmptyState";
import ChallengeCard from "./ChallengeCard";

const ChallengeList = async () => {
  const challenges: IChallenge[] = await getAllChallenges();

  if (!challenges || challenges.length === 0) {
    return (
      <EmptyState
        title="No Open Challenges"
        message="There are no challenges available at the moment. Please check back soon!"
        ctaText="Return Home"
        ctaLink="/"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {challenges.map((challenge) => (
        <ChallengeCard key={challenge._id} challenge={challenge} />
      ))}
    </div>
  );
};

export default ChallengeList;
