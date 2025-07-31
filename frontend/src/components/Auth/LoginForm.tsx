"use client";

import { LoginFormData, loginSchema } from "@/lib/validationSchemas";
import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const getDashboardPath = (
  role: "client" | "developer" | "admin" | null
): string => {
  switch (role) {
    case "admin":
      return "/admin";
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
  const [isUnverified, setIsUnverified] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    setIsUnverified(false);
    try {
      const response = await apiClient.post("/auth/login", data);
      const { token, user } = response.data;

      setToken(token);
      setUser(user);

      await axios.post("/api/auth", { token });

      const dashboardPath = getDashboardPath(user.role);
      router.push(dashboardPath);
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || "Invalid credentials.";
        if (errorMessage.includes("Please verify your email")) {
          setIsUnverified(true);
        }
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleResendVerification = async () => {
    const email = getValues("email");
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }

    setIsResending(true);
    setError("");
    try {
      await apiClient.post("/auth/resend-verification", { email });
      setIsUnverified(false);
      alert(
        "A new verification email has been sent to your inbox. Please check it to continue."
      );
    } catch (err) {
      setError("Failed to resend the email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      {isUnverified ? (
        <div className="alert alert-warning alert-vertical alert-soft">
          <div className="flex flex-col items-center gap-3 text-center">
            <div>
              <p className="font-bold">Account Not Verified</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-warning"
              onClick={handleResendVerification}
              disabled={isResending}
            >
              {isResending ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Resend Verification Email"
              )}
            </button>
          </div>
        </div>
      ) : (
        error && (
          <div className="toast">
            <p className="alert alert-error">{error}</p>
          </div>
        )
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
