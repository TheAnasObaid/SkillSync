"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/lib/validationSchemas";
import { useLoginMutation } from "./mutations/useLoginMutation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { resendVerificationEmail } from "@/services/api/auth";
import toast from "react-hot-toast";

export const useLoginForm = () => {
  const [unverifiedError, setUnverifiedError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useLoginMutation();

  // Create a separate, local mutation for resending the email
  const resendMutation = useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: () => {
      setUnverifiedError(null); // Hide the alert on success
      toast.success("A new verification link has been sent.");
    },
    onError: () => {
      toast.error("Failed to resend email. Please try again.");
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    setUnverifiedError(null); // Clear previous errors
    loginMutation.mutate(data, {
      onError: (error: any) => {
        const message = error.response?.data?.message || "Login failed.";
        if (message.includes("verify your email")) {
          setUnverifiedError(message);
        }
      },
    });
  };

  const handleResendVerification = () => {
    const email = form.getValues("email");
    if (email) {
      resendMutation.mutate(email);
    } else {
      toast.error("Please enter your email address first.");
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: loginMutation.isPending,
    unverifiedError,
    isResending: resendMutation.isPending,
    handleResendVerification,
  };
};
