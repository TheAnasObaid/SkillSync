import { api } from "@/lib/api";
import ChallengeCard, { Challenge } from "./ChallengeCard";

const ChallengeList = async () => {
  try {
    const challenges: Challenge[] = await api.get("/challenges");

    if (!challenges || challenges.length === 0) {
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
  } catch (error) {
    console.error(error);
    return (
      <p className="text-center text-error p-10">
        Failed to load challenges. Please try again later.
      </p>
    );
  }
};

export default ChallengeList;
