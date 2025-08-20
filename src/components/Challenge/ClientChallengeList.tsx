"use client";

import {
  useDeleteChallengeMutation,
  useFundChallengeMutation,
} from "@/hooks/mutations/useChallengeMutations";
import { getMyChallengesAsClient } from "@/services/api/challenges";
import { Challenge, ChallengeStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { FiCheckCircle, FiDollarSign, FiEdit, FiTrash2 } from "react-icons/fi";
import ConfirmationModal from "../Common/ConfirmationModal";
import EmptyState from "../Common/EmptyState";

const ClientChallengeList = () => {
  const {
    data: challenges,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["challenges", "my-client"],
    queryFn: getMyChallengesAsClient,
  });

  const { mutate: deleteMutate, isPending: isDeleting } =
    useDeleteChallengeMutation();
  const { mutate: fundMutate, isPending: isFunding } =
    useFundChallengeMutation();

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    challenge: Challenge | null;
  }>({ isOpen: false, challenge: null });
  const [fundModal, setFundModal] = useState<{
    isOpen: boolean;
    challenge: Challenge | null;
  }>({ isOpen: false, challenge: null });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton h-24 w-full rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (isError || !challenges) {
    return (
      <div className="alert alert-error alert-soft">
        Could not load challenges. Please try again later.
      </div>
    );
  }

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

  const handleDeleteConfirm = () => {
    if (deleteModal.challenge) {
      deleteMutate(deleteModal.challenge.id, {
        onSuccess: () => setDeleteModal({ isOpen: false, challenge: null }),
      });
    }
  };

  const handleFundConfirm = () => {
    if (fundModal.challenge) {
      fundMutate(fundModal.challenge.id, {
        onSuccess: () => setFundModal({ isOpen: false, challenge: null }),
      });
    }
  };

  const statusStyles: Record<ChallengeStatus, string> = {
    DRAFT: "badge-ghost",
    PUBLISHED: "badge-info",
    ACTIVE: "badge-info",
    JUDGING: "badge-warning",
    COMPLETED: "badge-success",
  };

  return (
    <>
      <div className="space-y-4">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
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
                  <Link
                    href={`/client/dashboard/challenges/review/${challenge.id}`}
                    className="font-bold text-lg link link-hover"
                  >
                    {challenge.title}
                  </Link>
                </div>
                <p className="text-sm text-base-content/60 mt-1">
                  Prize: ${challenge.prize.toLocaleString()}
                </p>
              </div>
              <div className="card-actions items-center justify-end mt-4 sm:mt-0">
                {challenge.isFunded ? (
                  <span className="badge badge-success badge-soft font-medium gap-1 text-xs">
                    <FiCheckCircle /> Funded
                  </span>
                ) : (
                  <button
                    onClick={() => setFundModal({ isOpen: true, challenge })}
                    className="btn btn-warning btn-sm"
                  >
                    <FiDollarSign /> Fund Prize
                  </button>
                )}
                <Link
                  href={`/client/dashboard/challenges/edit/${challenge.id}`}
                  className="btn btn-ghost btn-sm"
                >
                  <FiEdit /> Edit
                </Link>
                <button
                  onClick={() => setDeleteModal({ isOpen: true, challenge })}
                  className="btn btn-ghost btn-sm text-error"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ConfirmationModal
        isOpen={fundModal.isOpen}
        title="Fund Challenge Prize"
        message={`This will initiate the secure payment process for the $${fundModal.challenge?.prize.toLocaleString()} prize. Are you sure?`}
        onConfirm={handleFundConfirm}
        onCancel={() => setFundModal({ isOpen: false, challenge: null })}
        confirmText="Yes, Proceed"
        variant="primary"
        isActionInProgress={isFunding}
        icon={<FiDollarSign size={48} />}
      />
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${deleteModal.challenge?.title}"? This cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, challenge: null })}
        confirmText="Yes, Delete"
        variant="error"
        isActionInProgress={isDeleting}
        icon={<FiTrash2 size={48} />}
      />
    </>
  );
};

export default ClientChallengeList;
