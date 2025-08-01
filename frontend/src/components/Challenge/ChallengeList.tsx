import { getAllChallenges } from "@/services/server/challengeService";
import ChallengeCard from "./ChallengeCard";
import EmptyState from "../Common/EmptyState";

const ChallengeList = async () => {
  const challenges = await getAllChallenges();

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
