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
      setMessage(response.data.message);
    } catch (err) {
      setError(
        err instanceof AxiosError
          ? err.response?.data.message
          : "An error occurred."
      );
    }
  };

  return (
    <div className="max-w-md w-full mx-auto my-10 p-8 bg-base-200/50 border border-base-300 rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        Forgot Your Password?
      </h1>
      <p className="text-center text-base-content/70 mb-6">
        No problem. Enter your email address below, and we'll send you a link to
        reset it.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      {message && (
        <div className="alert alert-info alert-soft mt-4">{message}</div>
      )}
      {error && <div className="alert alert-error mt-4">{error}</div>}
    </div>
  );
};

export default ForgotPasswordPage;
