"use client";

import {
  rateSubmission,
  selectWinner,
  submitSolution,
  updateSubmission,
  withdrawSubmission,
} from "@/services/api/submissions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Submission } from "@prisma/client";

// --- FOR DEVELOPERS ---

interface SubmitSolutionVars {
  challengeId: string;
  formData: FormData;
}
export const useSubmitSolutionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: SubmitSolutionVars) => submitSolution(vars),
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

interface UpdateSubmissionVars {
  submissionId: string;
  formData: {
    githubRepo: string;
    liveDemo?: string;
    description: string;
  };
}
export const useUpdateSubmissionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: UpdateSubmissionVars) => updateSubmission(vars),
    onSuccess: () => {
      toast.success("Submission updated!");
      queryClient.invalidateQueries({ queryKey: ["submissions", "my"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Update failed.");
    },
  });
};

export const useWithdrawSubmissionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (submissionId: string) => withdrawSubmission(submissionId),
    onSuccess: () => {
      toast.success("Submission withdrawn.");
      queryClient.invalidateQueries({ queryKey: ["submissions", "my"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Could not withdraw submission."
      );
    },
  });
};

// --- FOR CLIENTS ---

interface RateSubmissionVars {
  submissionId: string;
  payload: { rating: number; feedback: string };
}
export const useRateSubmissionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: RateSubmissionVars) => rateSubmission(vars),
    onSuccess: (data: Submission) => {
      toast.success("Review saved!");
      queryClient.invalidateQueries({
        queryKey: ["submissions", "review", data.challengeId],
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
    mutationFn: (submissionId: string) => selectWinner(submissionId),
    onSuccess: (data: Submission) => {
      toast.success("Winner selected successfully!");
      queryClient.invalidateQueries({
        queryKey: ["submissions", "review", data.challengeId],
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to select winner.");
    },
  });
};
