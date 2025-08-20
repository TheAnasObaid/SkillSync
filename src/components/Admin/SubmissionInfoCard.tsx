"use client";

import Link from "next/link";
import UserAvatar from "../Profile/UserAvatar";
import { FiExternalLink } from "react-icons/fi";
import { Prisma, SubmissionStatus } from "@prisma/client";

const submissionWithDetails = Prisma.validator<Prisma.SubmissionDefaultArgs>()({
  include: {
    developer: {
      select: { id: true, firstName: true, email: true, image: true },
    },
    challenge: { select: { id: true, title: true } },
  },
});

type SubmissionWithDetails = Prisma.SubmissionGetPayload<
  typeof submissionWithDetails
>;

interface SubmissionInfoCardProps {
  submission: SubmissionWithDetails;
}

const statusStyles: Record<SubmissionStatus, string> = {
  PENDING: "badge-info",
  REVIEWED: "badge-ghost",
  WINNER: "badge-success",
  REJECTED: "badge-error",
};

const SubmissionInfoCard = ({ submission }: SubmissionInfoCardProps) => {
  const { developer, challenge } = submission;

  return (
    <div className="card bg-base-200/50 border border-base-300 shadow-md transition-all hover:border-primary/50">
      <div className="card-body p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <UserAvatar
              name={developer.firstName}
              image={developer.image}
              className="w-10 h-10"
            />
            <div>
              <p className="font-bold">{developer.firstName}</p>
              <p className="text-xs text-base-content/60">{developer.email}</p>
            </div>
          </div>
          <div
            className={`badge badge-outline capitalize ${
              statusStyles[submission.status] || "badge-ghost"
            }`}
          >
            {submission.status.toLowerCase()}
          </div>
        </div>

        <div className="divider my-2"></div>

        <div className="space-y-1">
          <p className="text-sm text-base-content/70">Submitted to:</p>
          <h3 className="font-semibold text-base-content text-lg leading-tight">
            {challenge.title}
          </h3>
        </div>

        <div className="card-actions justify-end mt-2">
          <Link
            href={`/challenges/${challenge.id}`}
            className="btn btn-ghost btn-sm"
          >
            View Challenge <FiExternalLink className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubmissionInfoCard;
