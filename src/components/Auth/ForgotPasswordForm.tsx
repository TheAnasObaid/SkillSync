"use client";

import { TextInput } from "@/components/Forms/FormFields";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiCheckCircle } from "react-icons/fi";
import { z } from "zod";
import AuthCardHeader from "./AuthCardHeader";
import AuthCardLayout from "./AuthCardLayout";

const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formMethods = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await signIn("email", {
        email: data.email,
        redirect: false,
        callbackUrl: "/",
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      setIsSuccess(true);
    } catch (error) {
      toast.error("Failed to send login link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            A magic link has been sent to your email address.
          </p>
        </div>
      ) : (
        <>
          <AuthCardHeader
            title="Forgot Password?"
            subtitle="Enter your email and we'll send you a secure link to sign in."
          />
          <FormProvider {...formMethods}>
            <form
              onSubmit={formMethods.handleSubmit(onSubmit)}
              className="grid gap-4"
            >
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
                  "Send Magic Link"
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
