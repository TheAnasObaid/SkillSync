"use client";

import { useLoginForm } from "@/hooks/useLoginForm";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { TextInput } from "../Forms/FormFields";
import AuthCardHeader from "./AuthCardHeader";
import AuthCardLayout from "./AuthCardLayout";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const isVerified = searchParams.get("verified") === "true";
  const verificationError = searchParams.get("error");

  const {
    form,
    onSubmit,
    isSubmitting,
    unverifiedError,
    isResending,
    handleResendVerification,
  } = useLoginForm();

  return (
    <AuthCardLayout
      footerText="Don't have an account?"
      footerLinkText="Sign Up"
      footerHref="/register"
    >
      {isVerified && (
        <SuccessAlert message="Email verified! You can now sign in." />
      )}

      {verificationError && (
        <div className="alert alert-error">{verificationError}</div>
      )}

      <AuthCardHeader
        title="Welcome Back"
        subtitle="Sign in to continue your journey on SkillSync."
      />
      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="grid gap-4">
          {unverifiedError && (
            <UnverifiedUserAlert
              error={unverifiedError}
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
              <span className="loading loading-spinner" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </FormProvider>
    </AuthCardLayout>
  );
};

export default LoginForm;

interface Props {
  error: string;
  onResend: () => void;
  isResending: boolean;
}

const UnverifiedUserAlert = ({ error, onResend, isResending }: Props) => (
  <div className="alert alert-warning alert-soft">
    <FiAlertTriangle />
    <div>
      <h3 className="font-bold">Account Not Verified</h3>
      <div className="text-xs">{error}</div>
    </div>
    <div className="flex-none">
      <button
        type="button"
        className="btn btn-sm btn-warning"
        onClick={onResend}
        disabled={isResending}
      >
        {isResending ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          "Resend Email"
        )}
      </button>
    </div>
  </div>
);

const SuccessAlert = ({ message }: { message: string }) => (
  <div className="alert alert-success alert-soft">
    <FiCheckCircle />
    <span>{message}</span>
  </div>
);
