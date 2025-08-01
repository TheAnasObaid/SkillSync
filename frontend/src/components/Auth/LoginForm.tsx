"use client";

import { useLoginForm } from "@/hooks/useLoginForm";
import Link from "next/link";
import { FiAlertTriangle } from "react-icons/fi";

// A small sub-component for the unverified user state
const UnverifiedUserAlert = ({
  error,
  onResend,
  isResending,
}: {
  error: string;
  onResend: () => void;
  isResending: boolean;
}) => (
  <div className="alert alert-warning">
    <FiAlertTriangle />
    <div>
      <h3 className="font-bold">Account Not Verified</h3>
      <div className="text-xs">{error}</div>
      <div className="mt-2">
        <button
          type="button"
          className="btn btn-sm btn-warning"
          onClick={onResend}
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
  </div>
);

const LoginForm = () => {
  // --- 1. USE THE CUSTOM HOOK ---
  // All the complex logic is now contained in this single line.
  const {
    form,
    isSubmitting,
    apiError,
    isUnverified,
    isResending,
    onSubmit,
    handleResendVerification,
  } = useLoginForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    // --- 2. THE UI IS CLEAN AND DECLARATIVE ---
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* The error display logic is now much simpler */}
      {isUnverified && (
        <UnverifiedUserAlert
          error={apiError}
          onResend={handleResendVerification}
          isResending={isResending}
        />
      )}

      <div className="space-y-2">
        <label className="label">Email</label>
        <input
          type="email"
          placeholder="name@example.com"
          className="input input-bordered w-full"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-error text-xs">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="label">Password</label>
        <input
          type="password"
          placeholder="6+ characters"
          className="input input-bordered w-full"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-error text-xs">{errors.password.message}</p>
        )}
      </div>

      <div className="text-right -mt-2">
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
