"use client";

import apiClient from "@/services/apiClient";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  email: string;
  password: string;
  role: "client" | "developer";
}

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  const router = useRouter();

  const [error, setError] = useState("");

  const onSubmit = async (formData: FormData) => {
    setError("");
    try {
      await apiClient.post("/auth/register", formData);
      router.push("/login?registered=true");
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data.message || "Registration failed.");
      } else {
        setError("An unexpected error occurred during registration.");
      }
    }
  };

  if (error)
    return (
      <div className="toast">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <div className="grid gap-2">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">First Name</legend>
          <input
            type="text"
            placeholder="e.g., John"
            className="input input-bordered bg-base-200 w-full"
            {...register("name", { required: "Name is required" })}
          />
        </fieldset>
        {errors.name && (
          <p className="text-error text-xs">{errors.name.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Email</legend>
          <input
            type="email"
            placeholder="name@example.com"
            className="input input-bordered bg-base-200 w-full"
            {...register("email", { required: "Email is required" })}
          />
        </fieldset>
        {errors.email && (
          <p className="text-error text-xs">{errors.email.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Password</legend>
          <input
            type="password"
            placeholder="6+ characters"
            className="input input-bordered bg-base-200 w-full"
            {...register("password", {
              required: "Password is required",
              minLength: 6,
            })}
          />
        </fieldset>
        {errors.password && (
          <p className="text-error text-xs">{errors.password.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">I am a...</legend>
          <select
            defaultValue=""
            className="select select-bordered bg-base-200 w-full"
            {...register("role", { required: "Please select a role" })}
          >
            <option value="" disabled>
              Select a role
            </option>
            <option value="developer">Developer</option>
            <option value="client">Client</option>
          </select>
        </fieldset>
        {errors.role && (
          <p className="text-error text-xs">{errors.role.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="loading loading-spinner"></span>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
};

export default RegisterForm;
