"use client";

import {
  useUpdateSubmissionMutation,
  useWithdrawSubmissionMutation,
} from "@/hooks/mutations/useSubmissionMutations";
import { useMySubmissionsQuery } from "@/hooks/queries/useSubmissionQueries";
import { ISubmission } from "@/types";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import ConfirmationModal from "../Common/ConfirmationModal";
import EmptyState from "../Common/EmptyState";
import EditSubmissionModal, {
  EditSubmissionFormData,
} from "../Submission/EditSubmissionModal";
import SubmissionCard from "./SubmissionCard";

interface Props {
  initialSubmissions?: ISubmission[];
}

const DeveloperSubmissionList = ({ initialSubmissions }: Props) => {
  const {
    data: submissionsFromQuery,
    isLoading,
    isError,
  } = useMySubmissionsQuery();

  const submissions = initialSubmissions || submissionsFromQuery;

  const { mutate: updateMutate, isPending: isUpdating } =
    useUpdateSubmissionMutation();
  const { mutate: withdrawMutate, isPending: isWithdrawing } =
    useWithdrawSubmissionMutation();

  const [editModal, setEditModal] = useState({
    isOpen: false,
    submission: null as ISubmission | null,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    submission: null as ISubmission | null,
  });

  if (isLoading) {
    return <div className="skeleton h-48 w-full"></div>;
  }

  if (isError || !submissions) {
    return (
      <div className="alert alert-error">Could not load your submissions.</div>
    );
  }

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

  const handleUpdateSubmit = (formData: EditSubmissionFormData) => {
    if (editModal.submission) {
      updateMutate(
        { submissionId: editModal.submission._id, formData },
        { onSuccess: () => setEditModal({ isOpen: false, submission: null }) }
      );
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.submission) {
      withdrawMutate(deleteModal.submission._id, {
        onSuccess: () => setDeleteModal({ isOpen: false, submission: null }),
      });
    }
  };

  return (
    <>
      <div className="space-y-4">
        {submissions.map((sub) => (
          <SubmissionCard
            key={sub._id}
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
        message="Are you sure you want to withdraw this submission? This action cannot be undone."
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
