// ===== File: frontend\src\components\Submission\SubmissionCard.tsx =====
"use client";

import { ISubmission } from "@/types";
import Link from "next/link";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import UserAvatar from "../Profile/UserAvatar";
import { MouseEvent } from "react";
import { useRouter } from "next/navigation";

interface Props {
  submission: ISubmission & { isNew?: boolean };
}

const SubmissionCard = ({ submission }: Props) => {
  const router = useRouter();

  const developer =
    typeof submission.developerId !== "string" ? submission.developerId : null;

  const challengeId =
    typeof submission.challengeId === "object"
      ? submission.challengeId._id
      : submission.challengeId;

  const handleInnerLinkClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  // FIX: Add a guard clause to prevent rendering if essential data is missing.
  if (!developer || !challengeId) {
    return null;
  }

  const handleCardClick = () => {
    router.push(`/challenges/${challengeId}/submissions/${submission._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`card transition-all duration-300 ease-in-out ${
        submission.isNew ? "bg-primary/20" : "bg-base-200/50"
      } border border-base-300 shadow-md hover:border-primary hover:-translate-y-1 group cursor-pointer`}
    >
      <div className="card-body p-6">
        <div className="flex items-center gap-3">
          <Link
            href={`/users/${developer._id}`}
            className="flex items-center gap-3 z-10"
            onClick={handleInnerLinkClick}
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

        <p className="text-base-content/80 my-4 line-clamp-2 min-h-[40px]">
          {submission.description}
        </p>

        <div className="card-actions justify-start items-center gap-2">
          <a
            href={submission.githubRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm z-10"
            onClick={handleInnerLinkClick}
          >
            <FiGithub /> GitHub
          </a>
          {submission.liveDemo && (
            <a
              href={submission.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm z-10"
              onClick={handleInnerLinkClick}
            >
              <FiExternalLink /> Live Demo
            </a>
          )}
          <div className="flex-grow text-right text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            View Details...
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionCard;
