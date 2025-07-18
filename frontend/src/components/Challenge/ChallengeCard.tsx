"use client";

import { Challenge } from "@/app/client/dashboard/page";
import { useRouter } from "next/router";

const ChallengeCard = ({ challenge }: { challenge: Challenge }) => {
  const router = useRouter();

  return (
    <div className="card bg-neutral-50">
      <div className="card-body">
        <h2 className="card-title text-xl">{challenge.title}</h2>
        <h3 className="font-bold text-lg">${challenge.prize}</h3>
        <p className="flex gap-1">
          Published at
          <span className="font-semibold">
            {new Date(challenge.createdAt).toLocaleDateString()}
          </span>
        </p>
        <p>{challenge.description}</p>
        <div className="card-actions justify-end">
          <button
            className="btn btn-secondary"
            onClick={() => router.push(`/challenges/${challenge._id}`)}
          >
            View Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
