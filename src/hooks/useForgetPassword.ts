"use client";

import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useForgotPasswordMutation } from "./mutations/useForgotPasswordMutation";

export const useForgotPassword = () => {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const {
    mutate: forgotPassword,
    isPending,
    isSuccess,
  } = useForgotPasswordMutation();

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = (data) => {
    forgotPassword(data);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: isPending,
    isSuccess,
  };
};
