"use client";

import { useState } from "react";
import { IChallenge } from "@/types";
import apiClient from "@/lib/apiClient";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

export const useChallengeManager = (initialChallenges: IChallenge[]) => {
  const [challenges, setChallenges] = useState<IChallenge[]>(initialChallenges);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const { user } = useAuthStore(); // <-- ADD THIS

  const openDeleteModal = (challenge: IChallenge) => {
    setModalState({
      isOpen: true,
      title: "Confirm Deletion",
      message: `Are you sure you want to delete "${challenge.title}"? This will also remove all submissions and cannot be undone.`,
      onConfirm: () => handleDeleteConfirm(challenge._id),
    });
  };

  const handleDeleteConfirm = async (challengeId: string) => {
    const deleteToast = toast.loading("Deleting challenge...");
    setIsDeleting(true);
    try {
      await apiClient.delete(`/challenges/${challengeId}`);
      setChallenges((prev) => prev.filter((c) => c._id !== challengeId));
      toast.success("Challenge deleted.", { id: deleteToast });
    } catch (error) {
      toast.error("Failed to delete challenge.", { id: deleteToast });
    } finally {
      setIsDeleting(false);
      closeModal();
    }
  };

  const closeModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  return {
    setChallenges,
    challenges,
    isDeleting,
    modalState,
    openDeleteModal,
    closeModal,
    currentUser: user,
  };
};
