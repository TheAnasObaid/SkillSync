"use client";

import { useRegisterForm } from "@/hooks/useRegisterForm";
import { FormProvider } from "react-hook-form";
import { Select, TextInput } from "../Forms/FormFields";
import AuthCardLayout from "./AuthCardLayout";
import AuthCardHeader from "./AuthCardHeader";

const RegisterForm = () => {
  const { form, isSubmitting, onSubmit } = useRegisterForm();

  return (
    <AuthCardLayout
      footerText="Already have an account?"
      footerLinkText="Sign In"
      footerHref="/login"
    >
      <AuthCardHeader
        title="Create Your Account"
        subtitle="Join a community of top developers and clients."
      />
      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="grid gap-4">
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
          <Select name="gender" label="Gender">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
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
    </AuthCardLayout>
  );
};

export default RegisterForm;
