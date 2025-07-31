"use client";
import { useForm } from "react-hook-form";
import apiClient from "@/lib/apiClient";
import { useState } from "react";
import { AxiosError } from "axios";

interface SubmissionFormData {
  githubRepo: string;
  liveDemo?: string;
  description: string;
  file: FileList;
}

interface Props {
  challengeId: string;
  onSuccess: () => void;
}
const SubmissionForm = ({ challengeId, onSuccess }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SubmissionFormData>();
  const [apiError, setApiError] = useState("");
  // THIS FUNCTION MUST BE MODIFIED TO USE FormData
  const onSubmit = async (data: SubmissionFormData) => {
    setApiError("");

    // 1. Create a FormData object. This is required for sending files.
    const formData = new FormData();

    // 2. Append all the text fields
    formData.append("githubRepo", data.githubRepo);
    formData.append("description", data.description);
    if (data.liveDemo) {
      formData.append("liveDemo", data.liveDemo);
    }

    // 3. Append the file if it exists
    if (data.file && data.file.length > 0) {
      formData.append("file", data.file[0]); // 'file' matches the name in our multer config
    }

    try {
      // 4. Send the FormData object instead of a JSON object
      await apiClient.post(`/submissions/challenge/${challengeId}`, formData, {
        headers: {
          // This header is set automatically by the browser when sending FormData,
          // so we don't explicitly set it, but it's important to know it's happening.
          "Content-Type": "multipart/form-data",
        },
      });
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

      <div>
        <label className="label">Submission File (Optional)</label>
        <input
          type="file"
          className="file-input file-input-bordered w-full"
          {...register("file")}
        />
        <p className="label-text-alt mt-1">
          You can upload a .zip, .pdf, or image file.
        </p>
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
