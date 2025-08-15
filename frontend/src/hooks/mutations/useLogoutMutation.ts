"use client";

import { logoutUser } from "@/services/api/auth";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useLogoutMutation = () => {
  const router = useRouter();
  const { logout: logoutFromStore } = useAuthStore();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      logoutFromStore();
      toast.success("You have been logged out.");
      router.push("/");
      router.refresh();
    },
    onError: (error: any) => {
      logoutFromStore();
      router.push("/");
      router.refresh();
      toast.error("Could not log out properly, but client state was cleared.");
    },
  });
};
