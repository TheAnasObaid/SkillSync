"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { logoutUser } from "@/services/api/auth";
import { useAuthStore } from "@/store/authStore";

interface LogoutVariables {
  onSuccessCallback?: () => void;
}

export const useLogoutMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout: logoutFromStore } = useAuthStore.getState();

  return useMutation({
    // The mutation function now accepts our variables object
    mutationFn: (variables?: LogoutVariables) => logoutUser(),
    onSuccess: (data, variables) => {
      logoutFromStore();
      queryClient.clear();
      toast.success("You have been logged out.");
      router.push("/");
      router.refresh();

      // --- THE FIX ---
      // If a success callback was provided, call it now.
      variables?.onSuccessCallback?.();
    },
    onError: (error, variables) => {
      logoutFromStore();
      queryClient.clear();
      toast.error("Logout failed, but client state was cleared.");
      router.push("/");
      router.refresh();
      // Also call the callback on error to ensure the modal always closes
      variables?.onSuccessCallback?.();
    },
  });
};
