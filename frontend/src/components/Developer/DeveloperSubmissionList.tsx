"use client";

import Link from "next/link";
import {
  FiAward,
  FiClock,
  FiEdit,
  FiExternalLink,
  FiTrash2,
} from "react-icons/fi";
import { ISubmission } from "@/types";
import NoSubmissions from "./NoSubmissions";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ConfirmationModal from "../Common/ConfirmationModal";

interface EditSubmissionFormData {
  githubRepo: string;
  liveDemo?: string;
  description: string;
}

interface Props {
  submissions: ISubmission[];
}

const statusStyles: { [key: string]: string } = {
  pending: "badge-info",
  reviewed: "badge-warning",
  winner: "badge-success",
  rejected: "badge-error",
};

const DeveloperSubmissionList = ({ submissions }: Props) => {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<ISubmission | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditSubmissionFormData>();

  const openEditModal = (submission: ISubmission) => {
    setSelectedSubmission(submission);
    setValue("githubRepo", submission.githubRepo);
    setValue("liveDemo", submission.liveDemo);
    setValue("description", submission.description);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (submission: ISubmission) => {
    setSelectedSubmission(submission);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateSubmit = async (data: EditSubmissionFormData) => {
    if (!selectedSubmission) return;
    setIsUpdating(true);
    try {
      await apiClient.put(`/submissions/${selectedSubmission._id}`, data);
      alert("Submission updated!");
      setIsEditModalOpen(false);
      router.refresh(); // Refresh the server-fetched data
    } catch (error) {
      alert("Failed to update submission.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSubmission) return;
    setIsUpdating(true);
    try {
      await apiClient.delete(`/submissions/${selectedSubmission._id}`);
      alert("Submission withdrawn!");
      setIsDeleteModalOpen(false);
      router.refresh();
    } catch (error) {
      alert("Failed to withdraw submission.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (submissions.length === 0) {
    return <NoSubmissions />;
  }

  return (
    <>
      <div className="space-y-4">
        {submissions.map((sub) => {
          if (typeof sub.challengeId === "string") {
            console.warn(
              `Submission ${sub._id} has an unpopulated challengeId.`
            );
            return null;
          }
          return (
            <div
              key={sub._id}
              className="card bg-base-200/50 border border-base-300 shadow-md transition-all hover:border-primary/50"
            >
              <div className="card-body p-6">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="card-title text-xl font-bold">
                    {sub.challengeId.title}
                  </h3>
                  <div
                    className={`badge badge-outline ${
                      statusStyles[sub.status]
                    }`}
                  >
                    {sub.status}
                  </div>
                </div>

                <div className="flex justify-between items-end mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <FiAward />
                      <span>
                        ${sub.challengeId.prize?.toLocaleString() || "N/A"}{" "}
                        Prize
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-base-content/70">
                      <FiClock />
                      <span>
                        Submitted on:{" "}
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/challenges/${sub.challengeId._id}`}
                      className="btn btn-soft btn-sm"
                    >
                      View Challenge <FiExternalLink className="ml-2" />
                    </Link>
                    <button
                      onClick={() => openEditModal(sub)}
                      className="btn btn-ghost btn-sm"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => openDeleteModal(sub)}
                      className="btn btn-ghost btn-sm text-error"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <dialog className={`modal ${isEditModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">Edit Your Submission</h3>
          <form
            onSubmit={handleSubmit(handleUpdateSubmit)}
            className="space-y-4 py-4"
          >
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
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText="Yes, Withdraw"
        confirmButtonClass="btn-error"
        isActionInProgress={isUpdating}
      />
    </>
  );
};

export default DeveloperSubmissionList;
