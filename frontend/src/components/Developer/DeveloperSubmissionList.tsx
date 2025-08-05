"use client";

import { useSubmissionsManager } from "@/hooks/useSubmissionsManager";
import { ISubmission } from "@/types";
import { FiTrash2 } from "react-icons/fi";
import ConfirmationModal from "../Common/ConfirmationModal";
import EmptyState from "../Common/EmptyState";
import EditSubmissionModal from "../Submission/EditSubmissionModal";
import SubmissionCard from "./SubmissionCard";

const DeveloperSubmissionList = ({
  submissions,
}: {
  submissions: ISubmission[];
}) => {
  const {
    isEditModalOpen,
    isDeleteModalOpen,
    isUpdating,
    selectedSubmission,
    openEditModal,
    openDeleteModal,
    closeModal,
    handleUpdateSubmit,
    handleDeleteConfirm,
  } = useSubmissionsManager();

  if (submissions.length === 0) {
    return (
      <EmptyState
        title="No Submissions Yet"
        message="Your journey to prove your skills starts with the first challenge."
        ctaText="Find a Challenge to Solve"
        ctaLink="/challenges"
      />
    );
  }

  return (
    <>
      <div className="space-y-4">
        {submissions.map((sub) => (
          <SubmissionCard
            key={sub._id}
            submission={sub}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        ))}
      </div>

      <EditSubmissionModal
        isOpen={isEditModalOpen}
        onClose={closeModal}
        onSubmit={handleUpdateSubmit}
        isSubmitting={isUpdating}
        submission={selectedSubmission}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Withdraw Submission"
        message="Are you sure you want to withdraw this submission? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={closeModal}
        confirmText="Yes, Withdraw"
        variant="error"
        isActionInProgress={isUpdating}
        icon={<FiTrash2 size={48} />}
      />
    </>
  );
};

export default DeveloperSubmissionList;
