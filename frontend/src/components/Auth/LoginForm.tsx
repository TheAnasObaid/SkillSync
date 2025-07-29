"use client";

import apiClient from "@/services/apiClient";
import { Role, useAuthStore } from "@/store/authStore";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface LoginFormData {
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
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError("");
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

  if (error)
    return (
      <div className="toast">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
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
          <p className="text-error text-xs">{errors.email.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Password</legend>
          <input
            type="password"
            className="input input-bordered bg-base-200 w-full"
            {...register("password", { required: "Password is required" })}
          />
        </fieldset>
        {errors.password && (
          <p className="text-error text-xs">{errors.password.message}</p>
        )}
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
