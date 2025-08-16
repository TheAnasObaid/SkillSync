import { IChallenge } from "@/types";
import Link from "next/link";
import { FiAward, FiChevronRight, FiInbox, FiUsers } from "react-icons/fi";

interface Props {
  challenges: IChallenge[];
}

const statusStyles: { [key: string]: string } = {
  draft: "badge-ghost",
  published: "badge-info",
  active: "badge-info",
  judging: "badge-warning",
  completed: "badge-success",
};

const RecentChallengePreview = ({ challenges }: Props) => {
  if (challenges.length === 0) {
    return (
      <div className="card bg-base-200/50 border border-base-300 border-dashed">
        <div className="card-body items-center text-center p-10">
          <FiInbox className="text-4xl text-base-content/30 mb-2" />
          <h3 className="font-bold">No Challenges Yet</h3>
          <p className="text-base-content/70">
            Post your first challenge to attract top talent.
          </p>
          <Link
            href="/client/dashboard/create"
            className="btn btn-primary btn-sm mt-4"
          >
            Create a Challenge
          </Link>
        </div>
      </div>
    );
  }

  // --- A redesigned, more informative card list ---
  return (
    <div className="space-y-3">
      {challenges.map((challenge) => (
        <Link
          key={challenge._id}
          href={`/client/dashboard/challenges/review/${challenge._id}`}
          className="card bg-base-200/50 border border-base-300 shadow-sm transition-all duration-200 ease-in-out hover:border-primary/50 hover:shadow-md hover:-translate-y-px"
        >
          <div className="card-body p-4">
            <div className="flex justify-between items-center">
              {/* Left Side: Title and Status */}
              <div className="flex-grow">
                <p className="font-bold text-base-content text-lg">
                  {challenge.title}
                </p>
                <div
                  className={`badge ${
                    statusStyles[challenge.status]
                  } badge-soft mt-1`}
                >
                  {challenge.status}
                </div>
              </div>

              {/* Right Side: Key Stats and Action */}
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-2 text-primary">
                  <FiAward size={18} />
                  <span className="font-semibold">
                    ${challenge.prize.toLocaleString()}
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-info">
                  <FiUsers size={18} />
                  <span className="font-semibold">
                    {challenge.submissions.length} Submissions
                  </span>
                </div>
                <FiChevronRight size={24} className="text-base-content/50" />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecentChallengePreview;
