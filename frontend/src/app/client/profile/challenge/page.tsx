"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  title: string;
  description: string;
  prize: number;
}

const NewChallenge = () => {
  const { setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(false);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = (formData: FormData) => {
    console.log(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md w-1/2 mt-10 mx-auto"
    >
      <h2 className="text-4xl font-bold">New Challenge</h2>

      <div className="space-y-1">
        <label className="label font-semibold">Title</label>
        <input
          className="input w-full"
          type="text"
          placeholder="Challenge title"
          {...register("title", { required: true })}
        />
        {errors.title && (
          <p className="label text-error text-sm">Title is required</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="label font-semibold">Description</label>
        <textarea
          className="textarea w-full"
          rows={5}
          placeholder="Describe the challenge..."
          {...register("description", { required: true })}
        />
        {errors.description && (
          <p className="label text-error text-sm">Descsription is required</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="label font-semibold">Prize</label>
        <input
          className="input w-full"
          type="number"
          placeholder="100"
          {...register("prize", { required: true })}
        />
        {errors.prize && (
          <p className="label text-error text-sm">Prize is required</p>
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

export default NewChallenge;
