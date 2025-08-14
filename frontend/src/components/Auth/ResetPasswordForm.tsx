"use client";

import { TextInput } from "@/components/Forms/FormFields";
import { useResetPassword } from "@/hooks/useResetPassword";
import { FormProvider } from "react-hook-form";
import AuthCardLayout from "./AuthCardLayout";
import AuthCardHeader from "./AuthCardHeader";

const ResetPasswordForm = () => {
  const { form, isSubmitting, onSubmit } = useResetPassword();

  return (
    <AuthCardLayout
      footerText="Remembered your password?"
      footerLinkText="Back to Login"
      footerHref="/login"
    >
      <AuthCardHeader
        title="Set a New Password"
        subtitle="Choose a new, secure password for your account."
      />
      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="grid gap-4">
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
            placeholder="Re-enter password"
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
    </AuthCardLayout>
  );
};

export default ResetPasswordForm;
