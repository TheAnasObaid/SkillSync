"use client";

import { RegisterFormData, registerSchema } from "@/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRegisterMutation } from "./mutations/useRegisterMutation";

export const useRegisterForm = () => {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", role: "developer" },
  });

  const { mutate: register, isPending: isSubmitting } = useRegisterMutation();

  const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
    register(data);
  };

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
