"use client";

import { useSubmissionsManager } from "@/hooks/useSubmissionsManager";
import { ISubmission } from "@/types";
import ConfirmationModal from "../Common/ConfirmationModal";
import EmptyState from "../Common/EmptyState";
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
    isSubmitting,
    selectedSubmission,
    form,
    openEditModal,
    openDeleteModal,
    closeModal,
    handleUpdateSubmit,
    handleDeleteConfirm,
  } = useSubmissionsManager();

  const {
    register,
    formState: { errors },
  } = form;

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

      {/* Edit Modal */}
      <dialog className={`modal ${isEditModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <button
            onClick={closeModal}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">Edit Your Submission</h3>
          <form onSubmit={handleUpdateSubmit} className="space-y-4 py-4">
            <div>
              <label className="label">GitHub Repository URL</label>
              <input
                type="url"
                className="input input-bordered w-full"
                {...register("githubRepo", { required: true })}
              />
              {errors.githubRepo && (
                <p className="text-error text-sm">This field is required.</p>
              )}
            </div>
            <div>
              <label className="label">Live Demo URL</label>
              <input
                type="url"
                className="input input-bordered w-full"
                {...register("liveDemo")}
              />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                className="textarea textarea-bordered w-full"
                {...register("description", { required: true })}
              ></textarea>
              {errors.description && (
                <p className="text-error text-sm">This field is required.</p>
              )}
            </div>
            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </dialog>

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
