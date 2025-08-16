import { ISubmission } from "@/types";
import Link from "next/link";
import UserAvatar from "../Profile/UserAvatar";
import { FiExternalLink } from "react-icons/fi";

interface SubmissionInfoCardProps {
  submission: ISubmission;
}

const statusStyles: { [key: string]: string } = {
  pending: "badge-info",
  reviewed: "badge-ghost",
  winner: "badge-success",
  rejected: "badge-error",
};

const SubmissionInfoCard = ({ submission }: SubmissionInfoCardProps) => {
  const { developerId: developer, challengeId: challenge } = submission;

  const developerName =
    typeof developer === "object" && developer?.profile
      ? developer.profile.firstName
      : "Anonymous";
  const developerAvatar =
    typeof developer === "object" && developer?.profile
      ? developer.profile.avatar
      : undefined;
  const challengeTitle =
    typeof challenge === "object" ? challenge.title : "Unknown Challenge";
  const challengeId = typeof challenge === "object" ? challenge._id : null;

  return (
    <div className="card bg-base-200/50 border border-base-300 shadow-md transition-all hover:border-primary/50">
      <div className="card-body p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <UserAvatar
              name={developerName}
              avatarUrl={developerAvatar}
              className="w-10 h-10"
            />
            <div>
              <p className="font-bold">{developerName}</p>
              {typeof developer === "object" && (
                <p className="text-xs text-base-content/60">
                  {developer.email}
                </p>
              )}
            </div>
          </div>
          <div
            className={`badge badge-outline ${
              statusStyles[submission.status] || "badge-ghost"
            }`}
          >
            {submission.status}
          </div>
        </div>

        <div className="divider my-2"></div>

        <div className="space-y-1">
          <p className="text-sm text-base-content/70">Submitted to:</p>
          <h3 className="font-semibold text-base-content text-lg leading-tight">
            {challengeTitle}
          </h3>
        </div>

        {challengeId && (
          <div className="card-actions justify-end mt-2">
            <Link
              href={`/challenges/${challengeId}`}
              className="btn btn-ghost btn-sm"
            >
              View Challenge <FiExternalLink className="ml-2" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionInfoCard;
