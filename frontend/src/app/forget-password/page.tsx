"use client";

import apiClient from "@/services/apiClient";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ForgotPasswordForm {
  email: string;
}

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (data: ForgotPasswordForm) => {
    setError("");
    setMessage("");
    try {
      const response = await apiClient.post("/auth/forgot-password", data);
      setMessage(
        "If an account with that email exists, a reset link has been generated. (Check the backend console for your dummy link)."
      );
      // In a real app, you wouldn't show the token to the user.
      console.log("TESTING TOKEN:", response.data.resetTokenForTesting);
    } catch (err) {
      setError(
        err instanceof AxiosError
          ? err.response?.data.message
          : "An error occurred."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto w-full my-10 p-8 bg-base-200/50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">
        Forgot Your Password?
      </h1>
      <p className="text-center text-base-content/70 mb-6">
        No problem. Enter your email address and we'll send you a link to reset
        it.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-2">
          <label htmlFor="email" className="label">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className="input input-bordered w-full"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-error text-xs mt-1">{errors.email.message}</p>
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
            "Send Reset Link"
          )}
        </button>
      </form>

      {message && <div className="alert alert-success mt-4">{message}</div>}
      {error && <div className="alert alert-error mt-4">{error}</div>}
    </div>
  );
};

export default ForgotPasswordPage;
