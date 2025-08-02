"use client";

import apiClient from "@/lib/apiClient";
import { getDashboardPath } from "@/lib/helper";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const useResetPassword = () => {
  const router = useRouter();
  const params = useParams();
  const { token: resetToken } = params as { token: string };
  const { setToken, setUser } = useAuthStore();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
    const toastId = toast.loading("Resetting your password...");

    try {
      const response = await apiClient.patch(
        `/auth/reset-password/${resetToken}`,
        {
          password: data.password,
        }
      );
      const { token, user } = response.data;

      setToken(token);
      setUser(user);
      await axios.post("/api/auth", { token });

      toast.success("Password reset successfully! You are now logged in.", {
        id: toastId,
        duration: 4000,
      });
      router.push(getDashboardPath(user.role));
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Failed to reset password. The link may be invalid or expired.";
      toast.error(message, { id: toastId });
    }
  };

  return {
    form,
    isSubmitting,
    submitHandler: handleSubmit(onSubmit),
  };
};
