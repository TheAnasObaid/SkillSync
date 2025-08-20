"use client";

import {
  addPortfolioItem,
  deletePortfolioItem,
  updateMyProfile,
  uploadMyAvatar,
} from "@/services/api/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { User } from "@prisma/client";

const MY_PROFILE_QUERY_KEY = ["users", "me"];

// The `updateMyProfile` function receives the profile data payload
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profileData: Partial<User>) => updateMyProfile(profileData),
    onSuccess: (updatedUser) => {
      toast.success("Profile updated successfully!");
      queryClient.setQueryData(MY_PROFILE_QUERY_KEY, updatedUser);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    },
  });
};

// The `uploadMyAvatar` function receives a FormData object
export const useUploadAvatarMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => uploadMyAvatar(formData),
    onSuccess: () => {
      toast.success("Avatar updated!");
      queryClient.invalidateQueries({ queryKey: MY_PROFILE_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Avatar upload failed.");
    },
  });
};

// The `addPortfolioItem` function receives a FormData object
export const useAddPortfolioItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => addPortfolioItem(formData),
    onSuccess: () => {
      toast.success("Portfolio item added!");
      queryClient.invalidateQueries({ queryKey: MY_PROFILE_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add item.");
    },
  });
};

// The `deletePortfolioItem` function receives a string `itemId`
export const useDeletePortfolioItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => deletePortfolioItem(itemId),
    onSuccess: () => {
      toast.success("Portfolio item deleted.");
      queryClient.invalidateQueries({ queryKey: MY_PROFILE_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete item.");
    },
  });
};
