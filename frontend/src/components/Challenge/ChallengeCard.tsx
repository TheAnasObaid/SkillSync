import { Challenge } from "@/app/client/dashboard/page";
import Link from "next/link";

const ChallengeCard = ({ challenge }: { challenge: Challenge }) => {
  return (
    <Link href={`/challenges/${challenge._id}`}>
      <div className="card bg-white transition shadow-sm hover:shadow-md">
        <div className="card-body">
          <div className="flex justify-between items-start">
            <h2 className="card-title text-2xl font-bold link">
              {challenge.title}
            </h2>
            <span className="badge badge-accent text-sm font-semibold">
              ${challenge.prize}
            </span>
          </div>
          <p className="text-gray-700">{challenge.description}</p>
          <p className="text-sm flex gap-1 text-gray-500">
            Published on
            <span className="font-medium text-gray-700">
              {new Date(challenge.createdAt).toLocaleDateString("en-US", {
                dateStyle: "medium",
              })}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ChallengeCard;
