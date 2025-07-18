"use client";

import { Role, useAuthStore } from "@/store/authStore";
import apiClient from "@/services/apiClient";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormData {
  email: string;
  password: string;
}

interface FetchUserResponse {
  token: string;
  status: string;
  user: {
    role: Role;
  };
}

const LoginForm = () => {
  const router = useRouter();
  const { setToken, setRole } = useAuthStore();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const { data } = await apiClient.post<FetchUserResponse>(
        "/auth/login",
        formData
      );

      setToken(data.token);
      setRole(data.user.role);
      router.push("/");
    } catch (error) {
      if (error instanceof AxiosError) setError(error.response?.data.error);
    }
  };

  if (error) return <p className="label text-error">{error}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <div className="grid gap-2">
        <label className="label font-semibold">Email</label>
        <input
          className="input w-full"
          type="text"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <p className="label text-error text-sm">Email is required</p>
        )}
      </div>
      <div className="grid gap-2">
        <label className="label font-semibold">Password</label>
        <input
          className="input w-full"
          type="password"
          {...register("password", { required: true })}
        />
        {errors.password && (
          <p className="label text-error text-sm">Password is required</p>
        )}
      </div>
      <button
        type="submit"
        className="btn btn-secondary mt-5"
        disabled={isSubmitting}
      >
        {isSubmitting && <span className="loading loading-spinner"></span>}
        {!isSubmitting && "Sign in"}
      </button>
    </form>
  );
};

export default LoginForm;
