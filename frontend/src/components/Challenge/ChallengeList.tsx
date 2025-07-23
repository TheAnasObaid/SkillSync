import Link from "next/link";
interface Challenge {
  _id: string;
  title: string;
  status: string;
  description: string;
  prize: number;
}

const ChallengeList = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/challenges`);
  const challenges: Challenge[] = await res.json();

  console.log(challenges);

  if (challenges.length < 1) return <p>No challenge found.</p>;

  return (
    <ul className="list bg-base-100 rounded-box shadow-md">
      {challenges.map((challenge) => (
        <li
          key={challenge._id}
          className="p-4 pb-2 text-xs opacity-60 tracking-wide"
        >
          <Link href={`/challenges/${challenge._id}`}>
            {challenge.title} - {challenge.description}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ChallengeList;
