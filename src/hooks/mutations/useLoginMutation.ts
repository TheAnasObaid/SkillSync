"use client";

import { getDashboardPath } from "@/lib/helper";
import { loginUser } from "@/services/api/auth";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useLoginMutation = () => {
  const router = useRouter();
  const { setAuth } = useAuthStore.getState();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAuth({ user: data.user, token: data.token });

      toast.success("Login successful!");
      const dashboardPath = getDashboardPath(data.user.role);
      router.push(dashboardPath);
      router.refresh();
    },
    onError: (error: any) => {
      if (!error.response?.data?.message.includes("verify your email")) {
        toast.error(error.response?.data?.message || "Invalid credentials.");
      }
    },
  });
};
