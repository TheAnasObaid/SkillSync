import { IChallenge } from "@/types";
import Link from "next/link";
import { FiArrowRight, FiClock, FiAward } from "react-icons/fi";
import UserAvatar from "../Profile/UserAvatar"; // <-- Import UserAvatar for client info

// The props interface should be updated to expect a potentially populated `createdBy` field
interface ChallengeCardProps {
  challenge: IChallenge;
}

const difficultyStyles = {
  beginner: "badge-success",
  intermediate: "badge-warning",
  advanced: "badge-error",
};

const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  // --- 1. ROBUST DATA HANDLING ---
  // Safely format the deadline and handle populated client data.
  const formattedDeadline = new Date(challenge.deadline).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const client =
    typeof challenge.createdBy === "object" ? challenge.createdBy : null;

  return (
    // --- 2. CONSISTENT STYLING ---
    // Added a `group` class to allow for hover effects on child elements.
    <div className="card bg-base-200/50 border border-base-300 shadow-md transition-all hover:shadow-xl hover:-translate-y-1 group">
      <div className="card-body p-6">
        {/* --- 3. CARD HEADER: Client Info & Prize --- */}
        <div className="flex justify-between items-center">
          {client ? (
            <div className="flex items-center gap-3">
              <UserAvatar
                name={client.profile.firstName}
                avatarUrl={client.profile.avatar}
                className="w-8 h-8"
              />
              <div>
                <p className="text-sm font-semibold">
                  {client.profile.firstName}
                </p>
                <p className="text-xs text-base-content/60">
                  {client.profile.companyName}
                </p>
              </div>
            </div>
          ) : (
            <div></div> // Empty div to keep the prize on the right
          )}
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <FiAward />
            <span>${challenge.prize.toLocaleString()}</span>
          </div>
        </div>

        <div className="divider my-3"></div>

        {/* --- 4. CARD BODY: Title and Description --- */}
        <h2 className="card-title text-2xl font-bold group-hover:text-primary transition-colors">
          <Link href={`/challenges/${challenge._id}`}>{challenge.title}</Link>
        </h2>
        <p className="text-base-content/70 mt-1 line-clamp-2">
          {challenge.description}
        </p>

        {/* --- 5. CARD FOOTER: Tags, Deadline, and CTA --- */}
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div
              className={`badge badge-outline ${
                difficultyStyles[challenge.difficulty]
              }`}
            >
              {challenge.difficulty}
            </div>
            {challenge.tags.slice(0, 3).map((tag) => (
              <div
                key={tag}
                className="badge badge-neutral badge-outline font-mono text-xs"
              >
                {tag}
              </div>
            ))}
          </div>
          <div className="card-actions justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <FiClock />
              <span>{formattedDeadline}</span>
            </div>
            <Link
              href={`/challenges/${challenge._id}`}
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
