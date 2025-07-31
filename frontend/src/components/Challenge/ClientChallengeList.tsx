import { IChallenge } from "@/types";
import Link from "next/link";

interface Props {
  challenges: IChallenge[];
}

const statusStyles = {
  draft: "badge-ghost",
  published: "badge-info",
  active: "badge-info",
  judging: "badge-warning",
  completed: "badge-success",
};

const ClientChallengeList = ({ challenges }: Props) => {
  if (challenges.length === 0) {
    return (
      <div className="text-center p-12 bg-base-200/50 border border-dashed border-base-300 rounded-lg">
        <h3 className="text-xl font-bold">No Challenges Found</h3>
        <p className="text-base-content/70 mt-2">
          You haven't posted any challenges yet.{" "}
          <Link href="/client/dashboard/create" className="link link-primary">
            Create one now
          </Link>{" "}
          to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold mb-6">My Challenges</h1>
      {challenges.map((challenge) => (
        <div
          key={challenge._id}
          className="card bg-base-200/50 border border-base-300 shadow-md transition-all hover:border-primary/50"
        >
          <div className="card-body p-4 flex-row justify-between items-center">
            <div>
              <p className="font-bold text-xl">{challenge.title}</p>
              <p className="text-sm text-base-content/60 mt-1">
                Prize: ${challenge.prize.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div
                className={`badge badge-outline ${
                  statusStyles[challenge.status]
                }`}
              >
                {challenge.status}
              </div>
              <Link
                href={`/challenges/${challenge._id}/review`}
                className="btn btn-secondary btn-sm"
              >
                Review Submissions
              </Link>
              {/* We will add Edit/Delete buttons here in a future step */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientChallengeList;
