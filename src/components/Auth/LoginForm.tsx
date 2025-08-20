"use client";

import { LoginFormData, loginSchema } from "@/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import { TextInput } from "../Forms/FormFields";
import AuthCardHeader from "./AuthCardHeader";
import AuthCardLayout from "./AuthCardLayout";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const isVerified = searchParams.get("verified") === "true";
  const verificationError = searchParams.get("error");
  const loginError =
    searchParams.get("error") === "CredentialsSignin"
      ? "Invalid email or password."
      : null;

  const formMethods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const { isSubmitting } = formMethods.formState;

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl,
    });

    if (result?.error) {
      toast.error(result.error);
    } else if (result?.ok) {
      toast.success("Login successful!");
      router.push(result.url || callbackUrl);
      router.refresh();
    }
  };

  return (
    <AuthCardLayout
      footerText="Don't have an account?"
      footerLinkText="Sign Up"
      footerHref="/register"
    >
      {isVerified && (
        <SuccessAlert message="Email verified! You can now sign in." />
      )}
      {verificationError && !isVerified && (
        <ErrorAlert message={verificationError} />
      )}
      {loginError && <ErrorAlert message={loginError} />}

      <AuthCardHeader
        title="Welcome Back"
        subtitle="Sign in to continue your journey."
      />

      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className="grid gap-4"
        >
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

          <div className="divider">OR</div>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl })}
            className="btn btn-secondary w-full flex items-center gap-2"
          >
            <FaGoogle /> Sign in with Google
          </button>
        </form>
      </FormProvider>
    </AuthCardLayout>
  );
};

const SuccessAlert = ({ message }: { message: string }) => (
  <div className="alert alert-success alert-soft mb-4">
    <FiCheckCircle />
    <span>{message}</span>
  </div>
);
const ErrorAlert = ({ message }: { message: string }) => (
  <div className="alert alert-error alert-soft mb-4">
    <FiCheckCircle />
    <span>{message}</span>
  </div>
);

export default LoginForm;
