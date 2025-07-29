"use client";

import apiClient from "@/services/apiClient";
import { useAuthStore } from "@/store/authStore";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ResetPasswordForm {
  password: string;
  passwordConfirm: string;
}

const ResetPasswordPage = () => {
  const router = useRouter();
  const params = useParams();
  const { token } = params as { token: string };
  const { setToken } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>();
  const [error, setError] = useState("");

  const onSubmit = async (data: ResetPasswordForm) => {
    setError("");
    if (data.password !== data.passwordConfirm) {
      return setError("Passwords do not match.");
    }

    try {
      const response = await apiClient.patch(`/auth/reset-password/${token}`, {
        password: data.password,
      });
      setToken(response.data.token); // Log the user in
      alert("Password has been reset successfully! You are now logged in.");
      router.push("/"); // Redirect to homepage
    } catch (err) {
      setError(
        err instanceof AxiosError
          ? err.response?.data.message
          : "Failed to reset password."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto w-full my-10 p-8 bg-base-200/50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">
        Reset Your Password
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-2">
          <label className="label">New Password</label>
          <input
            type="password"
            className="input input-bordered w-full"
            {...register("password", {
              required: "New password is required",
              minLength: 6,
            })}
          />
          {errors.password && (
            <p className="text-error text-xs mt-1">{errors.password.message}</p>
          )}
        </div>
        <div>
          <label className="label">Confirm New Password</label>
          <input
            type="password"
            className="input input-bordered w-full"
            {...register("passwordConfirm", {
              required: "Please confirm your password",
            })}
          />
          {errors.passwordConfirm && (
            <p className="text-error text-xs mt-1">
              {errors.passwordConfirm.message}
            </p>
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
            "Reset Password"
          )}
        </button>
      </form>

      {error && <div className="alert alert-error mt-4">{error}</div>}
    </div>
  );
};

export default ResetPasswordPage;
