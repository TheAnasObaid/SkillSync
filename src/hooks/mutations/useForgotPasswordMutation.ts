"use client";

import { forgotPassword } from "@/services/api/auth";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      toast.success(data.message, { duration: 5000 });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to send reset link. Please try again."
      );
    },
  });
};
