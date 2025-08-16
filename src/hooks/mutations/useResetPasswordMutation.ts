"use client";

import { getDashboardPath } from "@/lib/helper";
import { ResetPasswordFormData } from "@/lib/validationSchemas";
import { resetPassword } from "@/services/api/auth";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ResetPasswordVariables {
  token: string;
  formData: ResetPasswordFormData;
}

export const useResetPasswordMutation = () => {
  const router = useRouter();
  const { setAuth } = useAuthStore.getState();

  return useMutation({
    mutationFn: (variables: ResetPasswordVariables) => resetPassword(variables),
    onSuccess: (data) => {
      setAuth({ user: data.user, token: data.token });

      toast.success("Password reset! You are now logged in.", {
        duration: 4000,
      });
      router.push(getDashboardPath(data.user.role));
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Password reset failed.");
    },
  });
};
