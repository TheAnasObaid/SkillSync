import Link from "next/link";
import { FiArrowRight, FiClock, FiAward, FiUsers } from "react-icons/fi";
import UserAvatar from "../Profile/UserAvatar";
import { Prisma, ChallengeDifficulty } from "@prisma/client";

const challengeCardData = Prisma.validator<Prisma.ChallengeDefaultArgs>()({
  include: {
    createdBy: {
      select: { firstName: true, companyName: true, image: true },
    },
    _count: {
      select: { submissions: true },
    },
  },
});

type ChallengeCardProps = {
  challenge: Prisma.ChallengeGetPayload<typeof challengeCardData>;
};

const difficultyStyles: Record<ChallengeDifficulty, string> = {
  BEGINNER: "badge-success",
  INTERMEDIATE: "badge-warning",
  ADVANCED: "badge-error",
};

const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  const formattedDeadline = new Date(challenge.deadline).toLocaleDateString(
    undefined,
    { year: "numeric", month: "long", day: "numeric" }
  );

  const client = challenge.createdBy;

  return (
    <div className="card bg-base-200/50 border border-base-300 shadow-md transition-all hover:shadow-xl hover:-translate-y-1 group">
      <div className="card-body p-6">
        <div className="flex justify-between items-center">
          {client ? (
            <div className="flex items-center gap-3">
              <UserAvatar
                name={client.firstName}
                image={client.image}
                className="w-8 h-8"
              />
              <div>
                <p className="text-sm font-semibold">{client.firstName}</p>
                <p className="text-xs text-base-content/60">
                  {client.companyName}
                </p>
              </div>
            </div>
          ) : (
            <div></div>
          )}
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <FiAward />
            <span>${challenge.prize.toLocaleString()}</span>
          </div>
        </div>

        <div className="divider my-3"></div>

        <h2 className="card-title text-2xl font-bold group-hover:text-primary transition-colors">
          <Link href={`/challenges/${challenge.id}`}>{challenge.title}</Link>
        </h2>
        <p className="text-base-content/70 mt-1 line-clamp-2">
          {challenge.description}
        </p>

        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div
              className={`badge badge-soft ${
                difficultyStyles[challenge.difficulty]
              }`}
            >
              {challenge.difficulty}
            </div>
            {challenge.tags.slice(0, 3).map((tag) => (
              <div
                key={tag}
                className="badge badge-info badge-soft font-mono text-xs"
              >
                {tag}
              </div>
            ))}
          </div>
          <div className="card-actions justify-between items-center">
            <div className="flex items-center gap-4 text-sm text-base-content/70">
              <div className="flex items-center gap-2">
                <FiClock />
                <span>{formattedDeadline}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiUsers />
                <span>{challenge._count.submissions} Submissions</span>
              </div>
            </div>
            <Link
              href={`/challenges/${challenge.id}`}
              className="btn btn-primary btn-sm"
            >
              View Details <FiArrowRight className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
