"use client";

import { useAuthStore } from "@/store/authStore";
import apiClient from "@/services/apiClient";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  title: string;
  description: string;
  prize: number;
  requirements: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  deadline: Date;
  files: Array<Object>;
  tags: Array<string>;
}

const ChallengeForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const { setLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      await apiClient.post("/challenges", formData);
      router.push("/client/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) setError(error.response?.data.error);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p className="label text-error">{error}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
      <div className="grid gap-2">
        <label className="label font-semibold">Title</label>
        <input
          className="input w-full"
          type="text"
          {...register("title", { required: true })}
        />
        {errors.title && (
          <p className="label text-error text-sm">Title is required</p>
        )}
      </div>

      <div className="grid gap-2">
        <label className="label font-semibold">Category</label>
        <input
          className="input w-full"
          type="text"
          {...register("category", { required: true })}
        />
        {errors.category && (
          <p className="label text-error text-sm">Category is required</p>
        )}
      </div>

      <div className="grid gap-2">
        <label className="label font-semibold">Description</label>
        <textarea
          className="textarea w-full"
          rows={5}
          {...register("description", { required: true })}
        />
        {errors.description && (
          <p className="label text-error text-sm">Descsription is required</p>
        )}
      </div>

      <div className="grid gap-2">
        <label className="label font-semibold">Requirements</label>
        <input
          className="input w-full"
          type="text"
          {...register("requirements", { required: true })}
        />
        {errors.requirements && (
          <p className="label text-error text-sm">Requirements are required</p>
        )}
      </div>

      <div className="grid gap-2">
        <label className="label font-semibold">Files</label>
        <input
          className="file-input w-full"
          type="file"
          {...register("category", { required: true })}
        />
        {errors.category && (
          <p className="label text-error text-sm">Category is required</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="label font-semibold">Difficulty</label>
        <select
          defaultValue=""
          className="select w-full"
          {...register("difficulty", { required: true })}
        >
          <option value="" disabled>
            Select leavel
          </option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        {errors.difficulty && (
          <p className="label text-error text-sm">
            Difficulty level is required
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <label className="label font-semibold">Deadline</label>
        <input
          className="input w-full"
          type="date"
          {...register("deadline", { required: true })}
        />
        {errors.deadline && (
          <p className="label text-error text-sm">Deadline is required</p>
        )}
      </div>

      <div className="grid gap-2">
        <label className="label font-semibold">Prize</label>
        <input
          className="input w-full"
          type="number"
          {...register("prize", { required: true })}
        />
        {errors.prize && (
          <p className="label text-error text-sm">Prize is required</p>
        )}
      </div>

      <div className="grid gap-2">
        <label className="label font-semibold">Tags</label>
        <input
          className="input w-full"
          type="text"
          {...register("tags", { required: true })}
        />
        {errors.tags && (
          <p className="label text-error text-sm">Tags are required</p>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-secondary w-full mt-5"
        disabled={isSubmitting}
      >
        {isSubmitting && <span className="loading loading-spinner"></span>}
        {!isSubmitting && "Create Challenge"}
      </button>
    </form>
  );
};

export default ChallengeForm;
