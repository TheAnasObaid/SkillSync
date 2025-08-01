import { IChallenge } from "@/types";
import ChallengeCard from "./ChallengeCard";

interface Props {
  challenges: IChallenge[];
}

const ChallengeList = ({ challenges }: Props) => {
  if (!challenges || challenges.length === 0) {
    return (
      <p className="text-center text-base-content/70 p-10">
        No challenges available at the moment. Check back soon!
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {challenges.map((challenge) => (
        <ChallengeCard key={challenge._id} challenge={challenge} />
      ))}
    </div>
  );
};

export default ChallengeList;
