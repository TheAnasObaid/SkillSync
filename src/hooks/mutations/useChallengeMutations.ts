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

const MY_CHALLENGES_QUERY_KEY = ["challenges", "my-client"];

export const useCreateChallengeMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (formData: FormData) => createChallenge(formData),
    onSuccess: () => {
      toast.success("Challenge created successfully!");
      queryClient.invalidateQueries({ queryKey: MY_CHALLENGES_QUERY_KEY });
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
      queryClient.invalidateQueries({ queryKey: MY_CHALLENGES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["challenges", variables.id] });
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
    mutationFn: (challengeId: string) => deleteChallenge(challengeId),
    onSuccess: () => {
      toast.success("Challenge deleted.");
      queryClient.invalidateQueries({ queryKey: MY_CHALLENGES_QUERY_KEY });
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
    mutationFn: (challengeId: string) => fundChallenge(challengeId),
    onSuccess: (_, challengeId) => {
      toast.success("Challenge funded successfully!");
      queryClient.invalidateQueries({ queryKey: MY_CHALLENGES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["challenges", challengeId] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Funding failed. Please try again."
      );
    },
  });
};
