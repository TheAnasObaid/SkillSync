"use client";

import apiClient from "@/lib/apiClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const useForgotPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    const toastId = toast.loading("Sending reset link...");

    try {
      await apiClient.post("/auth/forgot-password", data);
      toast.success("If an account exists, a reset link has been sent.", {
        id: toastId,
        duration: 5000,
      });
      setIsSuccess(true);
    } catch (error) {
      toast.error("Failed to send link. Please try again later.", {
        id: toastId,
      });
    }
  };

  return {
    form,
    isSubmitting,
    isSuccess,
    submitHandler: handleSubmit(onSubmit),
  };
};
