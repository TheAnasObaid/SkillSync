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
  const { setToken, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (variables: ResetPasswordVariables) =>
      resetPassword({ token: variables.token, formData: variables.formData }),
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);

      toast.success("Password reset successfully! You are now logged in.", {
        duration: 4000,
      });

      router.push(getDashboardPath(data.user.role));
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to reset password. The link may be invalid or expired."
      );
    },
  });
};
