import { ISubmission } from "@/types";
import Link from "next/link"; // For potential future links
import UserAvatar from "../Profile/UserAvatar"; // For a richer UI

// A helper for styling status badges
const statusStyles: { [key: string]: string } = {
  pending: "badge-info",
  reviewed: "badge-ghost",
  winner: "badge-success",
  rejected: "badge-error",
};

// This component displays a single submission's details
const SubmissionInfoCard = ({ submission }: { submission: ISubmission }) => {
  const developer =
    typeof submission.developerId === "object" ? submission.developerId : null;
  const challenge =
    typeof submission.challengeId === "object" ? submission.challengeId : null;

  return (
    <div className="card bg-base-200/50 border border-base-300">
      <div className="card-body p-4 space-y-3">
        {/* Card Header: Developer Info */}
        <div className="flex items-center gap-3">
          <UserAvatar
            name={developer?.profile.firstName}
            avatarUrl={developer?.profile.avatar}
          />
          <div>
            <p className="font-bold">
              {developer?.profile.firstName || "Unknown Developer"}
            </p>
            <p className="text-xs text-base-content/60">{developer?.email}</p>
          </div>
        </div>

        <div className="divider my-0"></div>

        {/* Card Body: Challenge and Status */}
        <div>
          <p className="text-sm text-base-content/70">Challenge:</p>
          <p className="font-semibold">
            {challenge?.title || "Unknown Challenge"}
          </p>
        </div>

        {/* Card Footer: Status and Date */}
        <div className="card-actions justify-between items-center">
          <div
            className={`badge badge-outline ${
              statusStyles[submission.status] || "badge-ghost"
            }`}
          >
            {submission.status}
          </div>
          <p className="text-xs text-base-content/60">
            {new Date(submission.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubmissionInfoCard;
