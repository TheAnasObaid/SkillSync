"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "@/lib/validationSchemas";
import apiClient from "@/lib/apiClient";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useRegisterForm = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState("");

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "developer",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (formData: RegisterFormData) => {
    setApiError("");
    const registerToast = toast.loading("Creating your account...");

    try {
      await apiClient.post("/auth/register", formData);
      toast.success("Registration successful!", { id: registerToast });
      router.push(`/check-inbox?email=${formData.email}`);
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError
          ? err.response?.data.message || "Registration failed."
          : "An unexpected error occurred.";

      setApiError(errorMessage);
      toast.error(errorMessage, { id: registerToast });
    }
  };

  return {
    form,
    isSubmitting,
    apiError,
    onSubmit,
  };
};
