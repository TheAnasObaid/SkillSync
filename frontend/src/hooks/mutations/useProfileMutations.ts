"use client";

import {
  addPortfolioItem,
  deletePortfolioItem,
  updateMyProfile,
  uploadMyAvatar,
} from "@/services/api/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const MY_PROFILE_QUERY_KEY = ["users", "me"];

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (updatedUser) => {
      toast.success("Profile updated successfully!");
      queryClient.setQueryData(MY_PROFILE_QUERY_KEY, updatedUser);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    },
  });
};

export const useUploadAvatarMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadMyAvatar,
    onSuccess: () => {
      toast.success("Avatar updated!");
      queryClient.invalidateQueries({ queryKey: MY_PROFILE_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Avatar upload failed.");
    },
  });
};

export const useAddPortfolioItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addPortfolioItem,
    onSuccess: () => {
      toast.success("Portfolio item added!");
      queryClient.invalidateQueries({ queryKey: MY_PROFILE_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add item.");
    },
  });
};

export const useDeletePortfolioItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePortfolioItem,
    onSuccess: () => {
      toast.success("Portfolio item deleted.");
      queryClient.invalidateQueries({ queryKey: MY_PROFILE_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete item.");
    },
  });
};
