// ===== File: frontend\src\components\Auth\RegisterForm.tsx =====
"use client";

import { useRegisterForm } from "@/hooks/useRegisterForm";
import { FormProvider } from "react-hook-form";
import { TextInput, Select } from "../Forms/FormFields";
import Link from "next/link";

const RegisterForm = () => {
  const { form, isSubmitting, onSubmit } = useRegisterForm();
  const { handleSubmit } = form;

  return (
    <div className="grid gap-6 max-w-md w-full">
      <div className="card bg-base-200/50 border border-base-300 w-full shadow-lg">
        <div className="card-body p-8">
          <h1 className="card-title text-2xl font-bold justify-center">
            Create Your Account
          </h1>

          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mt-4">
              <TextInput
                name="name"
                label="First Name"
                type="text"
                placeholder="e.g., John"
              />

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

              <Select name="role" label="I am a...">
                <option value="developer">Developer</option>
                <option value="client">Client</option>
              </Select>

              <button
                type="submit"
                className="btn btn-primary w-full mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner" />
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </FormProvider>
        </div>
      </div>

      <div className="text-center text-sm text-base-content/70">
        <p>
          Already have an account?{" "}
          <Link href="/login" className="link link-primary font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
