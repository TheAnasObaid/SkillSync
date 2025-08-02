"use client";

import { ISubmission } from "@/types";
import { useSubmissionsManager } from "@/hooks/useSubmissionsManager";
import ConfirmationModal from "../Common/ConfirmationModal";
import EmptyState from "../Common/EmptyState";
import SubmissionCard from "./SubmissionCard";
import EditSubmissionModal from "../Submission/EditSubmissionModal";

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
    handleUpdateSubmit, // This is the raw handler from the hook
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

      {/* --- RENDER THE NEW, CLEANER MODALS --- */}
      <EditSubmissionModal
        isOpen={isEditModalOpen}
        onClose={closeModal}
        onSubmit={handleUpdateSubmit} // Pass the handler from the hook
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
        confirmButtonClass="btn-error"
        isActionInProgress={isUpdating}
      />
    </>
  );
};

export default DeveloperSubmissionList;
