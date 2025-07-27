"use client";

import { useAuthStore } from "@/store/authStore";
import apiClient from "@/services/apiClient";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

// This interface now matches exactly what the backend expects
interface FormData {
  title: string;
  description: string;
  prize: number;
  requirements: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  deadline: string; // Send deadline as a string in "YYYY-MM-DD" format
  tags: string; // Send tags as a single comma-separated string
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
    setError("");
    try {
      setLoading(true);
      await apiClient.post("/challenges", formData);
      router.push("/client/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(
          error.response?.data.message || "An unexpected error occurred."
        );
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      {error && <p className="alert alert-error alert-soft">{error}</p>}

      <div className="grid gap-2">
        <label className="label font-semibold">Title</label>
        <input
          className="input input-bordered w-full"
          type="text"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <label className="label font-semibold">Description</label>
        <textarea
          className="textarea textarea-bordered w-full"
          rows={5}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <label className="label font-semibold">Requirements</label>
        <textarea
          className="textarea textarea-bordered w-full"
          rows={3}
          {...register("requirements", {
            required: "Requirements are required",
          })}
        />
        {errors.requirements && (
          <p className="text-red-500 text-sm">{errors.requirements.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label className="label font-semibold">Category</label>
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="e.g., Web Development"
            {...register("category", { required: "Category is required" })}
          />
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="label font-semibold">Difficulty</label>
          <select
            defaultValue=""
            className="select select-bordered w-full"
            {...register("difficulty", {
              required: "Difficulty level is required",
            })}
          >
            <option value="" disabled>
              Select level
            </option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          {errors.difficulty && (
            <p className="text-red-500 text-sm">{errors.difficulty.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label className="label font-semibold">Deadline</label>
          <input
            className="input input-bordered w-full"
            type="date"
            {...register("deadline", { required: "Deadline is required" })}
          />
          {errors.deadline && (
            <p className="text-red-500 text-sm">{errors.deadline.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <label className="label font-semibold">Prize ($)</label>
          <input
            className="input input-bordered w-full"
            type="number"
            {...register("prize", {
              required: "Prize is required",
              valueAsNumber: true,
            })}
          />
          {errors.prize && (
            <p className="text-red-500 text-sm">{errors.prize.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <label className="label font-semibold">Tags</label>
        <input
          className="input input-bordered w-full"
          type="text"
          placeholder="e.g., javascript, react, nodejs"
          {...register("tags")}
        />
        <p className="text-xs text-gray-500">Enter tags separated by commas.</p>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full mt-5"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="loading loading-spinner"></span>
        ) : (
          "Create Challenge"
        )}
      </button>
    </form>
  );
};

export default ChallengeForm;
