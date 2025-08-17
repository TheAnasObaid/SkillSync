"use client";

import Link from "next/link";
import {
  FiAward,
  FiClock,
  FiEdit,
  FiExternalLink,
  FiTrash2,
} from "react-icons/fi";
import { Prisma, SubmissionStatus } from "@prisma/client";

const submissionWithChallenge =
  Prisma.validator<Prisma.SubmissionDefaultArgs>()({
    include: {
      challenge: { select: { id: true, title: true, prize: true } },
    },
  });

type SubmissionWithChallenge = Prisma.SubmissionGetPayload<
  typeof submissionWithChallenge
>;

interface Props {
  submission: SubmissionWithChallenge;
  onEdit: (submission: SubmissionWithChallenge) => void;
  onDelete: (submission: SubmissionWithChallenge) => void;
}

const statusStyles: Record<SubmissionStatus, string> = {
  PENDING: "badge-info",
  REVIEWED: "badge-warning",
  WINNER: "badge-success",
  REJECTED: "badge-error",
};

const SubmissionCard = ({ submission, onEdit, onDelete }: Props) => {
  const { challenge } = submission;

  if (!challenge) {
    return null;
  }

  const canTakeAction =
    submission.status === SubmissionStatus.PENDING ||
    submission.status === SubmissionStatus.REVIEWED;

  return (
    <div className="card bg-base-200/ ৫০ border border-base-300 shadow-md">
      <div className="card-body p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0">
            <h3 className="card-title text-xl font-bold truncate">
              {challenge.title}
            </h3>
          </div>
          <div
            className={`badge badge-outline flex-shrink-0 capitalize ${
              statusStyles[submission.status]
            }`}
          >
            {submission.status.toLowerCase()}
          </div>
        </div>
        <div className="flex justify-between items-end mt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <FiAward />
              <span>${challenge.prize?.toLocaleString() || "N/A"} Prize</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <FiClock />
              <span>
                Submitted: {new Date(submission.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/challenges/${challenge.id}`}
              className="btn btn-ghost btn-sm"
            >
              <FiExternalLink /> View Challenge
            </Link>
            {canTakeAction && (
              <>
                <button
                  onClick={() => onEdit(submission)}
                  className="btn btn-ghost btn-sm"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => onDelete(submission)}
                  className="btn btn-ghost btn-sm text-error"
                >
                  <FiTrash2 />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionCard;
