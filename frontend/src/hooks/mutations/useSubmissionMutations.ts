"use client";

import {
  rateSubmission,
  selectWinner,
  submitSolution,
  updateSubmission,
  withdrawSubmission,
} from "@/services/api/submissions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// --- FOR DEVELOPERS ---

export const useSubmitSolutionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitSolution,
    onSuccess: (data) => {
      toast.success("Solution submitted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["submissions", "public", data.challengeId],
      });
      queryClient.invalidateQueries({ queryKey: ["submissions", "my"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Submission failed.");
    },
  });
};

export const useUpdateSubmissionMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: updateSubmission,
    onSuccess: () => {
      toast.success("Submission updated!");
      queryClient.invalidateQueries({ queryKey: ["submissions", "my"] });
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Update failed.");
    },
  });
};

export const useWithdrawSubmissionMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: withdrawSubmission,
    onSuccess: () => {
      toast.success("Submission withdrawn.");
      queryClient.invalidateQueries({ queryKey: ["submissions", "my"] });
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Could not withdraw submission."
      );
    },
  });
};

// --- FOR CLIENTS ---

export const useRateSubmissionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rateSubmission,
    onSuccess: (data) => {
      toast.success("Review saved!");
      const challengeId =
        typeof data.challengeId === "string"
          ? data.challengeId
          : (data.challengeId as any)._id;
      queryClient.invalidateQueries({
        queryKey: ["submissions", "review", challengeId],
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to save review.");
    },
  });
};

export const useSelectWinnerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: selectWinner,
    onSuccess: (data) => {
      toast.success("Winner selected successfully!");
      const challengeId =
        typeof data.challengeId === "string"
          ? data.challengeId
          : (data.challengeId as any)._id;
      queryClient.invalidateQueries({
        queryKey: ["submissions", "review", challengeId],
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to select winner.");
    },
  });
};
