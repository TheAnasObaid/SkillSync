"use client";

import apiClient from "@/services/apiClient";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  content: string;
}

const SubmissionForm = ({ id }: { id: string }) => {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (formData: FormData) => {
    try {
      await apiClient.post(`/challenges/${id}/submit`, formData);
      router.push("/freelancer/profile");
    } catch (error) {
      if (error instanceof AxiosError) setError(error.response?.data);
    }
  };

  if (error) return <p className="label text-error">{error}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <h2 className="text-4xl font-semibold">Submit Solution</h2>
      <div className="grid gap-2">
        <label className="label font-semibold">Content</label>
        <textarea
          className="textarea w-full"
          rows={5}
          {...register("content", { required: true })}
        />
        {errors.content && (
          <p className="label text-error">Content is required</p>
        )}
      </div>
      <button
        type="submit"
        className="btn btn-secondary mt-5"
        disabled={isSubmitting}
      >
        {isSubmitting && <span className="loading loading-spinner"></span>}
        {!isSubmitting && "Submit"}
      </button>
    </form>
  );
};

export default SubmissionForm;
