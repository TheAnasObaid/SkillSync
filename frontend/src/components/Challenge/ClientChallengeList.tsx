"use client";
import { IChallenge } from "@/types";
import Link from "next/link";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { useState } from "react";
import ConfirmationModal from "../Common/ConfirmationModal";
import EmptyState from "../Common/EmptyState";

interface Props {
  challenges: IChallenge[];
}

const statusStyles = {
  draft: "badge-ghost",
  published: "badge-info",
  active: "badge-info",
  judging: "badge-warning",
  completed: "badge-success",
};

const ClientChallengeList = ({ challenges }: Props) => {
  const router = useRouter();
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (challenge: IChallenge) => {
    setModalState({
      isOpen: true,
      title: "Delete Challenge",
      message: `Are you sure you want to delete "${challenge.title}"? All associated submissions will also be removed. This cannot be undone.`,
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          await apiClient.delete(`/challenges/${challenge._id}`);
          alert("Challenge deleted successfully.");
          router.refresh();
        } catch (error) {
          alert("Failed to delete challenge.");
        } finally {
          setIsDeleting(false);
          setModalState({ ...modalState, isOpen: false });
        }
      },
    });
  };

  const handleCancelModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

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
        {challenges.map((challenge) => (
          <div
            key={challenge._id}
            className="card bg-base-200/50 border border-base-300 shadow-md transition-all hover:border-primary/50"
          >
            <div className="card-body p-4 flex-row justify-between items-center">
              <div>
                <p className="font-bold text-xl">{challenge.title}</p>
                <p className="text-sm text-base-content/60 mt-1">
                  Prize: ${challenge.prize.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`badge badge-outline ${
                    statusStyles[challenge.status]
                  }`}
                >
                  {challenge.status}
                </div>
                <Link
                  href={`/challenges/${challenge._id}/review`}
                  className="btn btn-secondary btn-sm"
                >
                  Review
                </Link>
                <Link
                  href={`/client/dashboard/challenges/edit/${challenge._id}`}
                  className="btn btn-ghost btn-sm"
                >
                  <FiEdit />
                </Link>
                <button
                  onClick={() => handleDelete(challenge)}
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
        onCancel={handleCancelModal}
        confirmText="Yes, Delete"
        confirmButtonClass="btn-error"
        isActionInProgress={isDeleting}
      />
    </>
  );
};

export default ClientChallengeList;
