import Link from "next/link";
import { FiArrowRight, FiClock } from "react-icons/fi";

export interface Challenge {
  _id: string;
  title: string;
  description: string;
  requirements: string;
  prize: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  deadline: string;
}

interface ChallengeCardProps {
  challenge: Challenge;
}

const difficultyStyles = {
  beginner: "badge-success",
  intermediate: "badge-warning",
  advanced: "badge-error",
};

const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  const formattedDeadline = challenge.deadline
    ? new Date(challenge.deadline).toLocaleDateString()
    : "No deadline";

  return (
    <div className="card bg-base-200/50 border border-base-300 shadow-md transition-all hover:border-primary/50">
      <div className="card-body p-6">
        <div className="flex justify-between items-start gap-4">
          <h2 className="card-title text-2xl font-bold">{challenge.title}</h2>
          <span className="text-2xl font-bold text-primary">
            ${challenge.prize.toLocaleString()}
          </span>
        </div>

        <p className="text-base-content/70 mt-2 mb-4">
          {challenge.description.substring(0, 140)}...
        </p>
        <div className="flex items-center gap-4">
          <div
            className={`badge badge-soft ${
              difficultyStyles[challenge.difficulty]
            }`}
          >
            {challenge.difficulty}
          </div>
          <div className="flex flex-wrap gap-2">
            {challenge.tags.slice(0, 3).map((tag) => (
              <div
                key={tag}
                className="badge badge-neutral badge-outline font-mono text-xs"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        <div className="divider my-4"></div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-base-content/70">
            <FiClock />
            <span>Deadline: {formattedDeadline}</span>
          </div>
          <Link
            href={`/challenges/${challenge._id}`}
            className="btn btn-outline btn-primary"
          >
            View Details <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
