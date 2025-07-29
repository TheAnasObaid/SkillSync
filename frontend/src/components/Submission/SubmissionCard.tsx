import Link from "next/link";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import UserAvatar from "../Profile/UserAvatar";

export interface PublicSubmission {
  _id: string;
  githubRepo: string;
  liveDemo?: string;
  description: string;
  developerId: {
    _id: string;
    profile: {
      firstName: string;
    };
  };
  createdAt: string;
}

interface SubmissionCardProps {
  submission: PublicSubmission;
}

const SubmissionCard = ({ submission }: SubmissionCardProps) => {
  return (
    <div className="card bg-base-200/50 border border-base-300 shadow-md transition-all hover:border-primary/50">
      <div className="card-body p-6">
        <div className="flex items-center gap-3">
          <UserAvatar name={submission.developerId.profile.firstName} />
          <div>
            <div className="font-bold">
              {submission.developerId.profile.firstName || "Anonymous"}
            </div>
            <div className="text-sm text-base-content/60">
              Submitted on:{" "}
              {new Date(submission.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <p className="text-base-content/80 my-4">{submission.description}</p>

        <div className="card-actions justify-start gap-2">
          <Link
            href={submission.githubRepo}
            target="_blank"
            className="btn btn-ghost btn-sm"
          >
            <FiGithub /> GitHub
          </Link>
          {submission.liveDemo && (
            <Link
              href={submission.liveDemo}
              target="_blank"
              className="btn btn-ghost btn-sm"
            >
              <FiExternalLink /> Live Demo
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionCard;
