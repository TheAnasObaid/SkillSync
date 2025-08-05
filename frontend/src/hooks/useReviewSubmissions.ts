// ===== File: frontend\src\hooks\useReviewSubmissions.ts =====
"use client";

import apiClient from "@/lib/apiClient";
import { ISubmission } from "@/types";
import { AxiosError } from "axios"; // FIX: Import AxiosError for type checking
import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface RatingFormData {
  rating: number;
  feedback: string;
}

export const useReviewSubmissions = (initialSubmissions: ISubmission[]) => {
  const [submissions, setSubmissions] =
    useState<ISubmission[]>(initialSubmissions);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] =
    useState<ISubmission | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [winnerModal, setWinnerModal] = useState({
    isOpen: false,
    submission: null as ISubmission | null,
  });

  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  const ratingForm = useForm<RatingFormData>();
  const { handleSubmit } = ratingForm;

  const filteredAndSortedSubmissions = useMemo(() => {
    return submissions
      .filter((sub) => {
        if (statusFilter === "all") return true;
        return sub.status === statusFilter;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [submissions, statusFilter, sortOrder]);

  const isChallengeCompleted = useMemo(
    () => submissions.some((s) => s.status === "winner"),
    [submissions]
  );

  const refreshSubmissions = async (challengeId: string) => {
    try {
      const res = await apiClient.get(
        `/submissions/challenge/${challengeId}/review`
      );
      setSubmissions(res.data);
    } catch {
      toast.error("Failed to refresh submissions.");
    }
  };

  const openRatingModal = (submission: ISubmission) => {
    setSelectedSubmission(submission);
    setIsRatingModalOpen(true);
  };
  const openWinnerModal = (submission: ISubmission) =>
    setWinnerModal({ isOpen: true, submission });
  const closeModal = () => {
    setIsRatingModalOpen(false);
    setWinnerModal({ isOpen: false, submission: null });
  };

  const handleRateSubmit: SubmitHandler<RatingFormData> = async (data) => {
    if (!selectedSubmission) return;
    const toastId = toast.loading("Saving review...");
    setIsUpdating(true);
    try {
      await apiClient.post(`/submissions/${selectedSubmission._id}/rate`, {
        ratings: { overall: data.rating },
        feedback: data.feedback,
      });
      await refreshSubmissions(selectedSubmission.challengeId as string);
      toast.success("Review saved!", { id: toastId });
      closeModal();
    } catch (error) {
      // FIX: Improved, user-friendly error handling
      let errorMessage =
        "An unexpected error occurred while saving the review.";
      if (error instanceof AxiosError && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSelectWinner = async () => {
    if (!winnerModal.submission) return;
    const toastId = toast.loading("Selecting winner...");
    setIsUpdating(true);
    try {
      await apiClient.patch(
        `/submissions/${winnerModal.submission._id}/winner`
      );
      await refreshSubmissions(winnerModal.submission.challengeId as string);
      toast.success("Winner selected successfully!", { id: toastId });
      closeModal();
    } catch (error) {
      // FIX: Improved, user-friendly error handling for selecting a winner.
      // This will now display specific messages from the backend like "Challenge prize has not been funded."
      let errorMessage =
        "An unexpected error occurred. Please try again later.";
      if (error instanceof AxiosError && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    submissions,
    expandedId,
    selectedSubmission,
    setExpandedId,
    isUpdating,
    statusFilter,
    setStatusFilter,
    sortOrder,
    setSortOrder,
    filteredAndSortedSubmissions,
    isChallengeCompleted,
    ratingForm,
    isRatingModalOpen,
    openRatingModal,
    winnerModal,
    openWinnerModal,
    closeModal,
    handleRateSubmit,
    handleSelectWinner,
  };
};
