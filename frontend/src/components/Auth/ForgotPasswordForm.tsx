"use client";

import Link from "next/link";
import { FormProvider } from "react-hook-form";
import { TextInput } from "@/components/Forms/FormFields";
import { FiCheckCircle, FiLogIn } from "react-icons/fi";
import { useForgotPassword } from "@/hooks/useForgetPassword";

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
    <div className="grid gap-6 max-w-md w-full">
      <div className="card bg-base-200/50 border border-base-300 w-full shadow-lg">
        <div className="card-body p-8">
          {isSuccess ? (
            <SuccessMessage />
          ) : (
            <>
              <div className="text-center">
                <h1 className="card-title text-2xl font-bold justify-center">
                  Forgot Password?
                </h1>
                <p className="text-base-content/70 mt-2">
                  No problem. Enter your email and we'll send a reset link.
                </p>
              </div>
              <FormProvider {...form}>
                <form onSubmit={onSubmit} className="grid gap-4 mt-4">
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
        </div>
      </div>
      {!isSuccess && (
        <div className="text-center text-sm text-base-content/70">
          <p>
            Remembered your password?{" "}
            <Link href="/login" className="link link-primary font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
