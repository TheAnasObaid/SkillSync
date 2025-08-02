"use client";

import apiClient from "@/lib/apiClient";
import { AxiosError } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export interface SubmissionFormData {
  githubRepo: string;
  liveDemo?: string;
  description: string;
  file?: FileList;
}

export const useSubmissionForm = (
  challengeId: string,
  onSuccess: () => void
) => {
  const form = useForm<SubmissionFormData>();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<SubmissionFormData> = async (data) => {
    const formData = new FormData();
    formData.append("githubRepo", data.githubRepo);
    formData.append("description", data.description);
    if (data.liveDemo) formData.append("liveDemo", data.liveDemo);
    if (data.file && data.file.length > 0)
      formData.append("file", data.file[0]);

    const submitToast = toast.loading("Submitting your solution...");

    try {
      await apiClient.post(`/submissions/challenge/${challengeId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Submission successful!", { id: submitToast });
      onSuccess(); // Call the parent's success handler
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data.message || "Submission failed."
          : "An unexpected error occurred.";
      toast.error(message, { id: submitToast });
    }
  };

  return {
    form,
    isSubmitting,
    submitHandler: handleSubmit(onSubmit), // Pre-bind the handler
  };
};
