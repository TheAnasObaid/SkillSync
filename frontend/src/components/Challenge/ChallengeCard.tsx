import Link from "next/link";

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
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
};

const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  const formattedDeadline = new Date(challenge.deadline).toLocaleDateString();

  return (
    <div className="card w-full bg-base-100 shadow-xl transition-transform hover:-translate-y-1">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h2 className="card-title text-2xl">{challenge.title}</h2>
          <div
            className={`badge badge-lg p-4 ${
              difficultyStyles[challenge.difficulty]
            }`}
          >
            {challenge.difficulty}
          </div>
        </div>
        <p className="mt-2 text-gray-600">
          {challenge.description.substring(0, 150)}...
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {challenge.tags.map((tag) => (
            <div key={tag} className="badge badge-outline">
              {tag}
            </div>
          ))}
        </div>

        <div className="card-actions justify-between items-center mt-6">
          <div className="font-semibold text-lg">
            Prize: <span className="text-secondary">${challenge.prize}</span>
          </div>
          <div className="text-sm text-gray-500">
            Deadline: {formattedDeadline}
          </div>
          <Link
            href={`/challenges/${challenge._id}`}
            className="btn btn-primary"
          >
            View Challenge
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
