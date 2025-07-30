"use client";

import { ChallengeFormData, challengeSchema } from "@/lib/validationSchemas";
import apiClient from "@/services/apiClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const ChallengeForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
  });

  const onSubmit = async (challengeFormData: ChallengeFormData) => {
    setError("");

    // 1. Create a FormData object for file uploads
    const formData = new FormData();

    // 2. Append all text fields from the form data
    Object.entries(challengeFormData).forEach(([key, value]) => {
      // We handle the file separately, so skip it here
      if (key !== "file" && value) {
        formData.append(key, value);
      }
    });

    // 3. Append the file if one was selected
    const fileList = challengeFormData.file as FileList;
    if (fileList && fileList.length > 0) {
      formData.append("file", fileList[0]);
    }

    try {
      await apiClient.post("/challenges", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      router.push("/client/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) {
        const zodIssues = error.response?.data?.issues;
        if (zodIssues) {
          setError(zodIssues.map((issue: any) => issue.message).join(". "));
        } else {
          setError(
            error.response?.data.message || "An unexpected error occurred."
          );
        }
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      {error && (
        <div className="toast">
          <p className="alert alert-error">{error}</p>
        </div>
      )}

      <div className="grid gap-2">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Title</legend>
          <input
            type="text"
            className="input input-bordered bg-base-200 w-full"
            {...register("title", { required: "Title is required" })}
          />
        </fieldset>
        {errors.title && (
          <p className="text-error text-xs">{errors.title.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Description</legend>
          <textarea
            rows={5}
            className="textarea input-bordered bg-base-200 w-full"
            {...register("description", {
              required: "Description is required",
            })}
          />
        </fieldset>
        {errors.description && (
          <p className="text-error text-xs">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Requirements</legend>
          <textarea
            rows={5}
            className="textarea input-bordered bg-base-200 w-full"
            {...register("requirements", {
              required: "Requirements are required",
            })}
          />
        </fieldset>
        {errors.requirements && (
          <p className="text-error text-xs">{errors.requirements.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Category</legend>
            <input
              type="text"
              className="input input-bordered bg-base-200 w-full"
              {...register("category", { required: "Category is required" })}
            />
          </fieldset>
          {errors.category && (
            <p className="text-error text-xs">{errors.category.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Difficulty</legend>
            <select
              defaultValue=""
              className="select input-bordered bg-base-200 w-full"
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
          </fieldset>
          {errors.difficulty && (
            <p className="text-error text-xs">{errors.difficulty.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Deadline</legend>
            <input
              type="date"
              className="input input-bordered bg-base-200 w-full"
              {...register("deadline", { required: "Deadline is required" })}
            />
          </fieldset>
          {errors.deadline && (
            <p className="text-error text-xs">{errors.deadline.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Prize ($)</legend>
            <input
              type="number"
              className="input input-bordered bg-base-200 w-full"
              {...register("prize", { required: "Prize is required" })}
            />
          </fieldset>
          {errors.prize && (
            <p className="text-error text-xs">{errors.prize.message}</p>
          )}
        </div>
      </div>
      <div className="grid gap-2">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Tags</legend>
          <input
            type="text"
            placeholder="e.g., javascript, react, nodejs"
            className="input input-bordered bg-base-200 w-full"
            {...register("tags", { required: "Tags are required" })}
          />
          <p className="label">Enter tags separated by commas.</p>
        </fieldset>
        {errors.tags && (
          <p className="text-error text-xs">{errors.tags.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Resource File (Optional)</legend>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            {...register("file")}
          />
          <p className="label">
            Attach any relevant documents, mockups, or datasets (.zip, .pdf,
            .png, etc.).
          </p>
        </fieldset>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
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
