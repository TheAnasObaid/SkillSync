"use client";

import { getDashboardPath } from "@/lib/helper";
import { loginUser } from "@/services/api/auth";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useLoginMutation = () => {
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);

      toast.success("Login successful!");

      // Redirect to the appropriate dashboard
      router.push(getDashboardPath(data.user.role));

      // Refresh server components to reflect logged-in state
      router.refresh();
    },
    onError: (error: any) => {
      if (!error.response?.data?.message.includes("verify your email")) {
        toast.error(
          error.response?.data?.message ||
            "Invalid credentials. Please try again."
        );
      }
    },
  });
};
