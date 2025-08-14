"use client";

import { TextInput } from "@/components/Forms/FormFields";
import { useResetPassword } from "@/hooks/useResetPassword";
import Link from "next/link";
import { FormProvider } from "react-hook-form";
import { FiLogIn } from "react-icons/fi";

const ResetPasswordForm = () => {
  const { form, isSubmitting, onSubmit } = useResetPassword();

  return (
    <div className="grid gap-6 max-w-md w-full">
      <div className="card bg-base-200/50 border border-base-300 w-full shadow-lg">
        <div className="card-body p-8">
          <div className="text-center">
            <h1 className="card-title text-2xl font-bold justify-center">
              Reset Your Password
            </h1>
            <p className="text-base-content/70 mt-2">
              Choose a new, secure password for your account.
            </p>
          </div>

          <FormProvider {...form}>
            <form onSubmit={onSubmit} className="grid gap-4 mt-4">
              <TextInput
                name="password"
                label="New Password"
                type="password"
                placeholder="6+ characters"
              />
              <TextInput
                name="passwordConfirm"
                label="Confirm New Password"
                type="password"
                placeholder="Re-enter your new password"
              />
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner" />
                ) : (
                  "Set New Password"
                )}
              </button>
            </form>
          </FormProvider>
        </div>
      </div>
      <div className="text-center text-sm text-base-content/70">
        <p>
          Remembered your password?{" "}
          <Link href="/login" className="link link-primary font-semibold">
            <FiLogIn className="inline-block mr-1" />
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
