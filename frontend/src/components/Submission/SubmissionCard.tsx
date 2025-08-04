import { ISubmission } from "@/types";
import Link from "next/link";
import { FiArrowRight, FiExternalLink, FiGithub } from "react-icons/fi";
import UserAvatar from "../Profile/UserAvatar";

interface Props {
  submission: ISubmission & { isNew?: boolean };
}

const SubmissionCard = ({ submission }: Props) => {
  const developer =
    typeof submission.developerId !== "string" ? submission.developerId : null;

  if (developer) {
    return (
      <div
        className={`card transition-colors duration-1000 ${
          submission.isNew ? "bg-primary/20" : "bg-base-200/50"
        } border border-base-300 shadow-md`}
      >
        <div className="card-body p-6">
          <div className="flex items-center gap-3">
            <Link
              href={`/users/${developer._id}`}
              className="flex items-center gap-3"
            >
              <UserAvatar
                name={developer.profile.firstName}
                avatarUrl={developer.profile.avatar}
              />
              <div>
                <div className="font-bold link link-hover">
                  {developer.profile.firstName || "Anonymous"}
                </div>
                <div className="text-sm text-base-content/60">
                  Submitted on:{" "}
                  {new Date(submission.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          </div>

          <p className="text-base-content/80 my-4 line-clamp-2">
            {submission.description}
          </p>

          <div className="card-actions justify-start gap-2">
            <Link
              href={submission.githubRepo}
              target="_blank"
              className="btn btn-secondary btn-sm"
            >
              <FiGithub /> GitHub
            </Link>
            {submission.liveDemo && (
              <Link
                href={submission.liveDemo}
                target="_blank"
                className="btn btn-secondary btn-sm"
              >
                <FiExternalLink /> Live Demo
              </Link>
            )}
            <div className="btn btn-sm btn-secondary btn-outline text-base-content/60 group-hover:text-primary transition-colors">
              Details <FiArrowRight className="ml-1" />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default SubmissionCard;
