"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/lib/validationSchemas";
import { useResetPasswordMutation } from "./mutations/useResetPasswordMutation";
import { useParams } from "next/navigation";

export const useResetPassword = () => {
  const params = useParams();
  const token = params.token as string;

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { mutate: resetPassword, isPending } = useResetPasswordMutation();

  const onSubmit: SubmitHandler<ResetPasswordFormData> = (formData) => {
    if (!token) return;
    resetPassword({ token, formData });
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: isPending,
  };
};
