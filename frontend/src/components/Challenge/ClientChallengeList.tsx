"use client";

import { IChallenge } from "@/types";
import Link from "next/link";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { useChallengeManager } from "@/hooks/useChallengeManager";
import ConfirmationModal from "../Common/ConfirmationModal";
import EmptyState from "../Common/EmptyState";

interface Props {
  initialChallenges: IChallenge[];
}

const statusStyles = {
  draft: "badge-ghost",
  published: "badge-info",
  active: "badge-info",
  judging: "badge-warning",
  completed: "badge-success",
};

const ClientChallengeList = ({ initialChallenges }: Props) => {
  const { challenges, isDeleting, modalState, openDeleteModal, closeModal } =
    useChallengeManager(initialChallenges);

  if (challenges.length === 0) {
    return (
      <EmptyState
        title="No Challenges Posted"
        message="Post your first development challenge to attract top talent."
        ctaText="Create a New Challenge"
        ctaLink="/client/dashboard/create"
      />
    );
  }

  return (
    <>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold mb-2">My Challenges</h1>
        {challenges.map((challenge) => (
          <div
            key={challenge._id}
            className="card bg-base-200/50 border border-base-300 shadow-md"
          >
            <div className="card-body p-4 flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex-grow">
                <div className="flex items-center gap-3">
                  <span
                    className={`badge badge-outline ${
                      statusStyles[challenge.status]
                    }`}
                  >
                    {challenge.status}
                  </span>
                  <p className="font-bold text-lg">{challenge.title}</p>
                </div>
                <p className="text-sm text-base-content/60 mt-1">
                  Prize: ${challenge.prize.toLocaleString()}
                </p>
              </div>
              <div className="card-actions justify-end mt-4 sm:mt-0">
                <Link
                  href={`/challenges/${challenge._id}/review`}
                  className="btn btn-secondary btn-sm"
                >
                  <FiEye /> Review
                </Link>
                <Link
                  href={`/client/dashboard/challenges/edit/${challenge._id}`}
                  className="btn btn-ghost btn-sm"
                >
                  <FiEdit />
                </Link>
                <button
                  onClick={() => openDeleteModal(challenge)}
                  className="btn btn-ghost btn-sm text-error"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        onConfirm={modalState.onConfirm}
        onCancel={closeModal}
        confirmText="Yes, Delete"
        variant="error"
        isActionInProgress={isDeleting}
      />
    </>
  );
};

export default ClientChallengeList;
