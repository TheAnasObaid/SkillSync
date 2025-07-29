"use client";

import { useForm } from "react-hook-form";
import apiClient from "@/services/apiClient";
import { useState } from "react";
import { AxiosError } from "axios";

interface SubmissionFormData {
  githubRepo: string;
  liveDemo?: string;
  description: string;
}

interface SubmissionFormProps {
  challengeId: string;
  onSuccess: () => void;
}

const SubmissionForm = ({ challengeId, onSuccess }: SubmissionFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SubmissionFormData>();
  const [apiError, setApiError] = useState("");

  const onSubmit = async (data: SubmissionFormData) => {
    setApiError("");
    try {
      await apiClient.post(`/challenges/${challengeId}/submit`, data);
      onSuccess();
    } catch (error) {
      if (error instanceof AxiosError) {
        setApiError(error.response?.data.message || "Submission failed.");
      } else {
        setApiError("An unexpected error occurred.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {apiError && <p className="text-error">{apiError}</p>}
      <div>
        <label className="label">GitHub Repository URL</label>
        <input
          type="url"
          className="input input-bordered w-full"
          {...register("githubRepo", { required: "GitHub URL is required" })}
        />
        {errors.githubRepo && (
          <p className="text-error text-sm">{errors.githubRepo.message}</p>
        )}
      </div>
      <div>
        <label className="label">Live Demo URL (Optional)</label>
        <input
          type="url"
          className="input input-bordered w-full"
          {...register("liveDemo")}
        />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea
          className="textarea textarea-bordered w-full"
          rows={5}
          {...register("description", { required: "Description is required" })}
        ></textarea>
        {errors.description && (
          <p className="text-error text-sm">{errors.description.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="btn btn-primary w-full mt-4"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="loading loading-spinner"></span>
        ) : (
          "Submit for Review"
        )}
      </button>
    </form>
  );
};

export default SubmissionForm;
