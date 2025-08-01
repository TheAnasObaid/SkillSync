"use client";

import apiClient from "@/lib/apiClient";
import { ISubmission } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export interface EditSubmissionFormData {
  githubRepo: string;
  liveDemo?: string;
  description: string;
}

export const useSubmissionsManager = () => {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<ISubmission | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<EditSubmissionFormData>();
  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

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

  const closeModal = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedSubmission(null);
  };

  const handleUpdateSubmit = async (data: EditSubmissionFormData) => {
    if (!selectedSubmission) return;

    const updateToast = toast.loading("Updating submission...");
    setIsUpdating(true);
    try {
      await apiClient.put(`/submissions/${selectedSubmission._id}`, data);
      toast.success("Submission updated!", { id: updateToast });
      closeModal();
      router.refresh();
    } catch (error) {
      toast.error("Failed to update submission.", { id: updateToast });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSubmission) return;

    const deleteToast = toast.loading("Withdrawing submission...");
    setIsUpdating(true);
    try {
      await apiClient.delete(`/submissions/${selectedSubmission._id}`);
      toast.success("Submission withdrawn!", { id: deleteToast });
      closeModal();
      router.refresh();
    } catch (error) {
      toast.error("Failed to withdraw submission.", { id: deleteToast });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isEditModalOpen,
    isDeleteModalOpen,
    isUpdating,
    isSubmitting,
    selectedSubmission,
    form,
    openEditModal,
    openDeleteModal,
    closeModal,
    handleUpdateSubmit: handleSubmit(handleUpdateSubmit),
    handleDeleteConfirm,
  };
};
