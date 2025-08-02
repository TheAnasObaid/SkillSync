"use client";

import { useLoginForm } from "@/hooks/useLoginForm";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { TextInput } from "../Forms/FormFields";
import SuccessAlert from "./SuccessAlert";
import UnverifiedUserAlert from "./UnverifiedAlert";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered");

  const {
    form,
    isSubmitting,
    isUnverified,
    isResending,
    apiError,
    onSubmit,
    handleResendVerification,
  } = useLoginForm();
  const { handleSubmit } = form;

  return (
    <div className="grid gap-6 max-w-md w-full">
      {isRegistered && <SuccessAlert />}

      <div className="card bg-base-200/50 border border-base-300 w-full shadow-lg">
        <div className="card-body p-8">
          <h1 className="card-title text-2xl font-bold justify-center">
            Welcome Back
          </h1>

          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mt-4">
              {isUnverified && (
                <UnverifiedUserAlert
                  error={apiError}
                  onResend={handleResendVerification}
                  isResending={isResending}
                />
              )}

              <TextInput
                name="email"
                label="Email"
                type="email"
                placeholder="name@example.com"
              />

              <TextInput
                name="password"
                label="Password"
                type="password"
                placeholder="6+ characters"
              />

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
                  <span className="loading loading-spinner" />
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </FormProvider>
        </div>
      </div>

      <div className="text-center text-sm text-base-content/70">
        <p>
          Don't have an account?{" "}
          <Link href="/register" className="link link-primary font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
