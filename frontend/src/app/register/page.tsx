"use client";

import apiClient from "@/utils/api-client";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type FormData = {
  name: string;
  email: string;
  password: string;
  role: "client" | "developer";
};

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  const router = useRouter();
  const [error, setError] = useState("");

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const res = await apiClient.post("/auth/register", formData);
      console.log(res.data);
      router.push("/");
    } catch (err) {
      if (err instanceof AxiosError) setError(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md w-1/2 mt-10 mx-auto"
    >
      <h2 className="text-4xl font-bold">Create account</h2>

      {error && <p className="label text-error text-sm">{error}</p>}

      <div className="space-y-1">
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

      <div className="space-y-1">
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

      <div className="space-y-1">
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

      <div className="space-y-1">
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
        className="btn btn-primary w-full mt-5"
        disabled={isSubmitting}
      >
        {isSubmitting && <span className="loading loading-spinner"></span>}
        {!isSubmitting && "Sign Up"}
      </button>
    </form>
  );
};

export default RegisterPage;
