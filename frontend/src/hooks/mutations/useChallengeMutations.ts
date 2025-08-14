"use client";

import {
  createChallenge,
  deleteChallenge,
  fundChallenge,
  updateChallenge,
} from "@/services/api/challenges";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useCreateChallengeMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createChallenge,
    onSuccess: () => {
      toast.success("Challenge created successfully!");
      queryClient.invalidateQueries({ queryKey: ["challenges", "my"] });
      router.push("/client/dashboard/challenges");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create challenge."
      );
    },
  });
};

interface UpdateChallengeVars {
  id: string;
  formData: FormData;
}
export const useUpdateChallengeMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (variables: UpdateChallengeVars) => updateChallenge(variables),
    onSuccess: (_, variables) => {
      toast.success("Challenge updated!");
      queryClient.invalidateQueries({ queryKey: ["challenges", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["challenges", "my"] });
      router.push("/client/dashboard/challenges");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update challenge."
      );
    },
  });
};

export const useDeleteChallengeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteChallenge,
    onSuccess: () => {
      toast.success("Challenge deleted.");
      queryClient.invalidateQueries({ queryKey: ["challenges", "my"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete challenge."
      );
    },
  });
};

export const useFundChallengeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fundChallenge,
    onSuccess: (data, challengeId) => {
      toast.success("Challenge funded successfully!");
      queryClient.invalidateQueries({ queryKey: ["challenges", challengeId] });
      queryClient.invalidateQueries({ queryKey: ["challenges", "my"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Funding failed. Please try again."
      );
    },
  });
};
