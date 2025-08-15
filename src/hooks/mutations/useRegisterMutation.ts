"use client";

import { RegisterFormData } from "@/lib/validationSchemas";
import { registerUser } from "@/services/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useRegisterMutation = () => {
  const router = useRouter();

  return useMutation<{ message: string }, Error, RegisterFormData>({
    mutationFn: registerUser,
    onSuccess: (data, variables) => {
      toast.success(data.message || "Registration successful!");
      router.push(`/check-inbox?email=${variables.email}`);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    },
  });
};
