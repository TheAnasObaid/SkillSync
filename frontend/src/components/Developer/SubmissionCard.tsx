"use client";

import { ISubmission } from "@/types";
import Link from "next/link";
import {
  FiAward,
  FiClock,
  FiEdit,
  FiExternalLink,
  FiTrash2,
} from "react-icons/fi";

interface Props {
  submission: ISubmission;
  onEdit: (submission: ISubmission) => void;
  onDelete: (submission: ISubmission) => void;
}

const statusStyles: { [key: string]: string } = {
  pending: "badge-info",
  reviewed: "badge-warning",
  winner: "badge-success",
  rejected: "badge-error",
};

const SubmissionCard = ({ submission, onEdit, onDelete }: Props) => {
  const challenge =
    typeof submission.challengeId === "object" ? submission.challengeId : null;

  if (!challenge) return null;

  const canTakeAction =
    submission.status === "pending" || submission.status === "reviewed";

  return (
    <div className="card bg-base-200/50 border border-base-300 shadow-md">
      <div className="card-body p-6">
        <div className="flex justify-between items-start gap-4">
          <h3 className="card-title text-xl font-bold">{challenge.title}</h3>
          <div
            className={`badge badge-outline ${statusStyles[submission.status]}`}
          >
            {submission.status}
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
              href={`/challenges/${challenge._id}`}
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
