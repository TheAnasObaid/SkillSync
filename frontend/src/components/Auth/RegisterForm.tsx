"use client";

import apiClient from "@/services/apiClient";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormData {
  name: string;
  email: string;
  password: string;
  role: "client" | "developer" | "admin";
}

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  const router = useRouter();
  const [error, setError] = useState("");

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      await apiClient.post("/auth/register", formData);
      router.push("/login");
    } catch (error) {
      if (error instanceof AxiosError) setError(error.message);
      console.log(error);
    }
  };

  if (error) return <p className="label text-error">{error}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <div className="flex flex-col gap-2">
        <label className="label font-semibold">Name</label>
        <input
          className="input w-full"
          type="text"
          {...register("name", { required: true })}
        />
        {errors.name && (
          <p className="label text-error text-sm">Name is required</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="label font-semibold">Email</label>
        <input
          className="input w-full"
          type="text"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <p className="label text-error text-sm">Email is required</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="label font-semibold">Password</label>
        <input
          className="input w-full"
          type="password"
          {...register("password", { required: true })}
        />
        {errors.password && (
          <p className="label text-error text-sm">Password is required</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="label font-semibold">Role</label>
        <select
          defaultValue=""
          className="select w-full"
          {...register("role", { required: true })}
        >
          <option value="" disabled>
            Select a role
          </option>
          <option value="client">Client</option>
          <option value="developer">Developer</option>
        </select>
        {errors.role && (
          <p className="label text-error text-sm">Role is required</p>
        )}
      </div>
      <button
        type="submit"
        className="btn btn-secondary mt-5"
        disabled={isSubmitting}
      >
        {isSubmitting && <span className="loading loading-spinner"></span>}
        {!isSubmitting && "Sign Up"}
      </button>
    </form>
  );
};

export default RegisterForm;
