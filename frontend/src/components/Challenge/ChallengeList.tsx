import { IChallenge } from "@/types";
import ChallengeCard from "./ChallengeCard";

interface Props {
  challenges: IChallenge[];
}

const ChallengeList = ({ challenges }: Props) => {
  if (challenges.length === 0) {
    return (
      <p className="text-center text-gray-500 p-10">
        No challenges available at the moment. Check back soon!
      </p>
    );
  }

  return (
    <div className="grid gap-8">
      {challenges.map((challenge) => (
        <ChallengeCard key={challenge._id} challenge={challenge} />
      ))}
    </div>
  );
};

export default ChallengeList;
