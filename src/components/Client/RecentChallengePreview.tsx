import { ChallengeStatus, Prisma } from "@prisma/client";
import Link from "next/link";
import { FiAward, FiChevronRight, FiInbox, FiUsers } from "react-icons/fi";

const challengeWithSubmissionCount =
  Prisma.validator<Prisma.ChallengeDefaultArgs>()({
    include: { _count: { select: { submissions: true } } },
  });

type ChallengeWithSubmissionCount = Prisma.ChallengeGetPayload<
  typeof challengeWithSubmissionCount
>;

interface Props {
  challenges: ChallengeWithSubmissionCount[];
}

const statusStyles: Record<ChallengeStatus, string> = {
  DRAFT: "badge-ghost",
  PUBLISHED: "badge-info",
  ACTIVE: "badge-info",
  JUDGING: "badge-warning",
  COMPLETED: "badge-success",
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

  return (
    <div className="space-y-3">
      {challenges.map((challenge) => (
        <Link
          key={challenge.id}
          href={`/client/dashboard/challenges/review/${challenge.id}`}
          className="card bg-base-200/50 border border-base-300 shadow-sm transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-px"
        >
          <div className="card-body p-4">
            <div className="flex justify-between items-center">
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
                    {challenge._count.submissions} Submissions
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
