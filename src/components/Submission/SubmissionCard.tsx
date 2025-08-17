"use client";

import Link from "next/link";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import UserAvatar from "../Profile/UserAvatar";
import { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Prisma } from "@prisma/client";

const publicSubmission = Prisma.validator<Prisma.SubmissionDefaultArgs>()({
  include: {
    developer: {
      select: {
        id: true,
        firstName: true,
        avatarUrl: true,
      },
    },
  },
});

type PublicSubmission = Prisma.SubmissionGetPayload<typeof publicSubmission>;

interface Props {
  submission: PublicSubmission & { isNew?: boolean };
}

const SubmissionCard = ({ submission }: Props) => {
  const router = useRouter();

  const { developer, challengeId } = submission;

  const handleInnerLinkClick = (e: MouseEvent) => e.stopPropagation();

  if (!developer || !challengeId) {
    return null;
  }

  const handleCardClick = () => {
    router.push(`/challenges/${challengeId}/submissions/${submission.id}`);
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
            href={`/users/${developer.id}`}
            className="flex items-center gap-3 z-10"
            onClick={handleInnerLinkClick}
          >
            <UserAvatar
              name={developer.firstName}
              avatarUrl={developer.avatarUrl}
            />
            <div>
              <div className="font-bold link link-hover">
                {developer.firstName || "Anonymous"}
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
