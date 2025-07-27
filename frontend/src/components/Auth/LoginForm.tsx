"use client";

import { Role, useAuthStore } from "@/store/authStore";
import apiClient from "@/services/apiClient";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";

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

      if (data.user.role === "admin") router.push("/admin/panel");
      else if (data.user.role === "developer")
        router.push("/developer/dashboard");
      else if (data.user.role === "client") router.push("/client/dashboard");
      else router.push("/");
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
      <p className="text-gray-600 text-sm text-center">Or</p>
      <Link
        href="/register"
        className="link link-hover text-secondary w-fit mx-auto"
      >
        Create a new account
      </Link>
    </form>
  );
};

export default LoginForm;
