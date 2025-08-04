"use client";

import { useChallengeManager } from "@/hooks/useChallengeManager";
import apiClient from "@/lib/apiClient";
import { IChallenge } from "@/types";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FiCheckCircle,
  FiDollarSign,
  FiEdit,
  FiEye,
  FiTrash2,
} from "react-icons/fi";
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
  const {
    challenges,
    setChallenges,
    isDeleting,
    modalState,
    openDeleteModal,
    closeModal,
  } = useChallengeManager(initialChallenges);
  const [isFunding, setIsFunding] = useState(false);
  const [fundModalState, setFundModalState] = useState({
    isOpen: false,
    challenge: null as IChallenge | null,
  });

  const openFundModal = (challenge: IChallenge) => {
    setFundModalState({ isOpen: true, challenge });
  };

  const handleFundConfirm = async () => {
    if (!fundModalState.challenge) return;
    setIsFunding(true);
    const toastId = toast.loading("Processing payment...");
    try {
      const res = await apiClient.patch(
        `/challenges/${fundModalState.challenge._id}/fund`
      );
      // Update the state of this challenge to reflect it's now funded
      setChallenges((prev) =>
        prev.map((c) =>
          c._id === fundModalState.challenge?._id ? res.data.challenge : c
        )
      );
      toast.success("Challenge funded successfully!", { id: toastId });
    } catch (error) {
      toast.error("Funding failed.", { id: toastId });
    } finally {
      setIsFunding(false);
      setFundModalState({ isOpen: false, challenge: null });
    }
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
                {challenge.isFunded ? (
                  <span className="badge badge-success badge-soft font-medium gap-1 text-xs">
                    <FiCheckCircle /> Funded
                  </span>
                ) : (
                  <button
                    onClick={() => openFundModal(challenge)}
                    className="btn btn-warning btn-sm"
                  >
                    <FiDollarSign /> Fund Prize
                  </button>
                )}
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
        isOpen={fundModalState.isOpen}
        title="Fund Challenge"
        message={`This will simulate a payment of $${fundModalState.challenge?.prize.toLocaleString()} for "${
          fundModalState.challenge?.title
        }". Do you want to proceed?`}
        onConfirm={handleFundConfirm}
        onCancel={() => setFundModalState({ isOpen: false, challenge: null })}
        confirmText="Yes, Pay Now"
        variant="primary"
        isActionInProgress={isFunding}
        icon={<FiDollarSign size={48} />}
      />

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
