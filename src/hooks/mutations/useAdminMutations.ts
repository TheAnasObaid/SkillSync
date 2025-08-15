"use client";

import { updateUserAsAdmin } from "@/services/api/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateUserByAdminMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserAsAdmin,
    onSuccess: () => {
      toast.success("User updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["users", "all"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update user.");
    },
  });
};
