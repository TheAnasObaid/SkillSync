"use client";

import { LoginFormData, loginSchema } from "@/lib/validationSchemas";
import apiClient from "@/services/apiClient";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const getDashboardPath = (
  role: "client" | "developer" | "admin" | null
): string => {
  switch (role) {
    case "admin":
      return "/admin/panel";
    case "developer":
      return "/developer/dashboard";
    case "client":
      return "/client/dashboard";
    default:
      return "/";
  }
};

const LoginForm = () => {
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    try {
      const response = await apiClient.post("/auth/login", data);
      const { token, user } = response.data;

      setToken(token);
      setUser(user);

      const dashboardPath = getDashboardPath(user.role);

      router.push(dashboardPath);
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.error || "Login failed.");
      } else {
        console.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      {error && (
        <div className="toast">
          <p className="alert alert-error">{error}</p>
        </div>
      )}

      <div className="grid gap-2">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Email</legend>
          <input
            type="email"
            placeholder="name@example.com"
            className="input input-bordered bg-base-200 w-full"
            {...register("email", { required: "Email is required" })}
          />
        </fieldset>
        {errors.email && (
          <p className="text-error text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Password</legend>
          <input
            type="password"
            placeholder="6+ characters"
            className="input input-bordered bg-base-200 w-full"
            {...register("password", {
              required: "Password is required",
              minLength: 6,
            })}
          />
        </fieldset>
        {errors.password && (
          <p className="text-error text-sm">{errors.password.message}</p>
        )}
      </div>

      <div className="text-right">
        <Link
          href="/forgot-password"
          className="text-sm link link-hover text-primary"
        >
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="loading loading-spinner"></span>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
