"use client";

import {
  useUpdateSubmissionMutation,
  useWithdrawSubmissionMutation,
} from "@/hooks/mutations/useSubmissionMutations";
import { useMySubmissionsQuery } from "@/hooks/queries/useSubmissionQueries";
import { Submission } from "@prisma/client";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import ConfirmationModal from "../Common/ConfirmationModal";
import EmptyState from "../Common/EmptyState";
import EditSubmissionModal, {
  EditSubmissionFormData,
} from "../Submission/EditSubmissionModal";
import SubmissionCard from "./SubmissionCard";

interface Props {
  initialSubmissions?: Submission[]; // Allow passing initial data for dashboard preview
}

const DeveloperSubmissionList = ({ initialSubmissions }: Props) => {
  const { data: submissions, isLoading, isError } = useMySubmissionsQuery();

  const { mutate: updateMutate, isPending: isUpdating } =
    useUpdateSubmissionMutation();
  const { mutate: withdrawMutate, isPending: isWithdrawing } =
    useWithdrawSubmissionMutation();

  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    submission: Submission | null;
  }>({ isOpen: false, submission: null });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    submission: Submission | null;
  }>({ isOpen: false, submission: null });

  if (isLoading && !initialSubmissions) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton h-20 w-full rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error alert-soft">
        Could not load submissions.
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <EmptyState
        title="No Submissions Yet"
        message="Your journey starts with the first challenge."
        ctaText="Find a Challenge"
        ctaLink="/challenges"
      />
    );
  }

  const handleUpdateSubmit = (formData: EditSubmissionFormData) => {
    if (editModal.submission) {
      updateMutate(
        { submissionId: editModal.submission.id, formData },
        { onSuccess: () => setEditModal({ isOpen: false, submission: null }) }
      );
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.submission) {
      withdrawMutate(deleteModal.submission.id, {
        onSuccess: () => setDeleteModal({ isOpen: false, submission: null }),
      });
    }
  };

  return (
    <>
      <div className="space-y-4">
        {submissions.map((sub) => (
          <SubmissionCard
            key={sub.id}
            submission={sub}
            onEdit={() => setEditModal({ isOpen: true, submission: sub })}
            onDelete={() => setDeleteModal({ isOpen: true, submission: sub })}
          />
        ))}
      </div>
      <EditSubmissionModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, submission: null })}
        onSubmit={handleUpdateSubmit}
        isSubmitting={isUpdating}
        submission={editModal.submission}
      />
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Withdraw Submission"
        message="Are you sure you want to withdraw this submission?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, submission: null })}
        confirmText="Yes, Withdraw"
        variant="error"
        isActionInProgress={isWithdrawing}
        icon={<FiTrash2 size={48} />}
      />
    </>
  );
};

export default DeveloperSubmissionList;
