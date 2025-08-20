"use client";

import { RegisterFormData, registerSchema } from "@/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Select, TextInput } from "../Forms/FormFields";
import AuthCardHeader from "./AuthCardHeader";
import AuthCardLayout from "./AuthCardLayout";
import { registerUser } from "@/services/api/auth";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";

const RegisterForm = () => {
  const router = useRouter();

  const formMethods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      email: "",
      password: "",
      role: "developer",
      gender: "male",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      const response = await registerUser(data);
      toast.success(response.message || "Registration successful!");

      router.push(`/check-inbox?email=${data.email}`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

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

      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <TextInput
            name="firstName"
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

          <div className="divider">OR</div>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="btn btn-outline w-full flex items-center gap-2"
          >
            <FaGoogle /> Sign up with Google
          </button>
        </form>
      </FormProvider>
    </AuthCardLayout>
  );
};

export default RegisterForm;
