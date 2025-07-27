import ChallengeCard from "./ChallengeCard";
import { Challenge } from "@/app/client/dashboard/page";

const ChallengeList = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/challenges`);
  const challenges: Challenge[] = await res.json();

  if (challenges.length < 1) return <p>No challenges found.</p>;

  return (
    <ul className="list">
      {challenges.map((challenge) => (
        <li key={challenge._id}>
          <ChallengeCard challenge={challenge} />
        </li>
      ))}
    </ul>
  );
};

export default ChallengeList;
