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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-3 text-center text-error-content bg-error/20 rounded-md">
          {error}
        </div>
      )}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Your Name</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Jane Doe"
          className="input input-bordered bg-base-200 w-full"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <p className="text-error text-sm mt-1">{errors.name.message}</p>
        )}
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Email</span>
        </label>
        <input
          type="email"
          placeholder="name@example.com"
          className="input input-bordered bg-base-200 w-full"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <p className="text-error text-sm mt-1">{errors.email.message}</p>
        )}
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Password</span>
        </label>
        <input
          type="password"
          placeholder="6+ characters"
          className="input input-bordered bg-base-200 w-full"
          {...register("password", {
            required: "Password is required",
            minLength: 6,
          })}
        />
        {errors.password && (
          <p className="text-error text-sm mt-1">{errors.password.message}</p>
        )}
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">I am a...</span>
        </label>
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
        {errors.role && (
          <p className="text-error text-sm mt-1">{errors.role.message}</p>
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
