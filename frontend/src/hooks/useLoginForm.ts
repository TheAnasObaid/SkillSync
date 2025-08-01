"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/lib/validationSchemas";
import { useAuthStore } from "@/store/authStore";
import apiClient from "@/lib/apiClient";
import axios, { AxiosError } from "axios";
import { getDashboardPath } from "@/lib/helper";
import toast from "react-hot-toast";

export const useLoginForm = () => {
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();

  // State for API-related feedback
  const [apiError, setApiError] = useState("");
  const [isUnverified, setIsUnverified] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Initialize react-hook-form
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const {
    getValues,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: LoginFormData) => {
    setApiError("");
    setIsUnverified(false);
    const loginToast = toast.loading("Signing in...");

    try {
      const response = await apiClient.post("/auth/login", data);
      const { token, user } = response.data;

      setToken(token);
      setUser(user);
      await axios.post("/api/auth", { token });

      toast.success("Login successful!", { id: loginToast });

      const dashboardPath = getDashboardPath(user.role);
      router.push(dashboardPath);
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message ||
            error.response?.data?.error ||
            "Invalid credentials."
          : "An unexpected error occurred.";

      if (errorMessage.includes("Please verify your email")) {
        setIsUnverified(true);
      }

      setApiError(errorMessage);
      toast.error(errorMessage, { id: loginToast });
    }
  };

  const handleResendVerification = async () => {
    const email = getValues("email");
    if (!email) {
      toast.error("Please enter your email address first.");
      return;
    }

    setIsResending(true);
    const resendToast = toast.loading("Sending email...");

    try {
      await apiClient.post("/auth/resend-verification", { email });
      setIsUnverified(false); // Hide the resend block on success
      setApiError(""); // Clear old errors
      toast.success("A new verification email has been sent.", {
        id: resendToast,
      });
    } catch (err) {
      toast.error("Failed to resend email. Please try again.", {
        id: resendToast,
      });
    } finally {
      setIsResending(false);
    }
  };

  return {
    form,
    isSubmitting,
    apiError,
    isUnverified,
    isResending,
    onSubmit,
    handleResendVerification,
  };
};
