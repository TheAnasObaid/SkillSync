"use client";

import { TextInput } from "@/components/Forms/FormFields";
import { useForgotPassword } from "@/hooks/useForgetPassword";
import Link from "next/link";
import { FormProvider } from "react-hook-form";
import { FiCheckCircle, FiLogIn } from "react-icons/fi";
import AuthCardHeader from "./AuthCardHeader";
import AuthCardLayout from "./AuthCardLayout";

const SuccessMessage = () => (
  <div className="text-center space-y-4">
    <FiCheckCircle className="text-success text-6xl mx-auto" />
    <h2 className="text-2xl font-bold">Check Your Inbox</h2>
    <p className="text-base-content/70">
      If an account with that email address exists, we've sent a link to reset
      your password.
    </p>
    <Link href="/login" className="btn btn-primary btn-outline">
      <FiLogIn /> Back to Login
    </Link>
  </div>
);

const ForgotPasswordForm = () => {
  const { form, isSubmitting, isSuccess, onSubmit } = useForgotPassword();

  return (
    <AuthCardLayout
      footerText="Remembered your password?"
      footerLinkText="Sign In"
      footerHref="/login"
    >
      {isSuccess ? (
        <div className="text-center space-y-4 grid justify-items-center">
          <FiCheckCircle className="text-success text-6xl" />
          <h2 className="text-xl font-bold">Check Your Inbox</h2>
          <p className="text-base-content/70">
            If an account exists for that email, a reset link has been sent.
          </p>
        </div>
      ) : (
        <>
          <AuthCardHeader
            title="Forgot Password?"
            subtitle="Enter your email and we'll send you a link to reset it."
          />
          <FormProvider {...form}>
            <form onSubmit={onSubmit} className="grid gap-4">
              <TextInput
                name="email"
                label="Your Email Address"
                type="email"
                placeholder="name@example.com"
              />
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner" />
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </FormProvider>
        </>
      )}
    </AuthCardLayout>
  );
};

export default ForgotPasswordForm;
