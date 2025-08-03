import { IChallenge } from "@/types";
import Link from "next/link";
import { FiEye } from "react-icons/fi";

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

const RecentChallengePreview = ({ challenges }: Props) => {
  if (challenges.length === 0) {
    return (
      <div className="text-center p-8 bg-base-200/50 border border-base-300 rounded-lg">
        <p className="text-base-content/70">
          You haven't posted any challenges yet.
        </p>
        <Link
          href="/client/dashboard/create"
          className="btn btn-primary btn-sm mt-4"
        >
          Create Your First Challenge
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {challenges.map((challenge) => (
        <div
          key={challenge._id}
          className="card bg-base-200/50 border border-base-300"
        >
          <div className="card-body p-4 flex-row justify-between items-center">
            <div>
              <p className="font-semibold">{challenge.title}</p>
              <div
                className={`badge badge-xs ${
                  statusStyles[challenge.status]
                } mt-1`}
              >
                {challenge.status}
              </div>
            </div>
            <Link
              href={`/challenges/${challenge._id}/review`}
              className="btn btn-ghost btn-sm"
            >
              <FiEye /> View
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentChallengePreview;
