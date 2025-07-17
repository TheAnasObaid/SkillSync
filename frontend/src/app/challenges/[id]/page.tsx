"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import apiClient from "@/utils/api-client";
import ProtectedRoute from "@/app/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";

interface Challenge {
  _id: string;
  title: string;
  description: string;
  prize: number;
  status: "open" | "closed";
}

interface FormData {
  content: string;
}

export default function SingleChallengePage() {
  const { id } = useParams();
  const router = useRouter();
  const [error, setError] = useState("");
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const { setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const { data } = await apiClient.get(`/challenges/${id}`);
        setChallenge(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChallenge();
  }, [id]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (formData: FormData) => {
    try {
      await apiClient.post(`/challenges/${id}/submit`, formData);
      router.push("/developer/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) setError(error.response?.data);
    }
  };

  if (!challenge) return <p>Loading challenge...</p>;

  return (
    <ProtectedRoute requiredRole="developer">
      <div className="grid grid-cols-2">
        <div className="p-4 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold">{challenge.title}</h1>
          <p>{challenge.description}</p>
          <p className="font-semibold">Prize: ${challenge.prize}</p>
        </div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mx-auto">
            <h2 className="text-4xl font-bold">Submit Solution</h2>

            {error && <p className="label text-error text-sm">{error}</p>}

            <div className="space-y-1">
              <label className="label font-semibold">Content</label>
              <textarea
                className="textarea w-full"
                rows={5}
                {...register("content", { required: true })}
              />
              {errors.content && (
                <p className="label text-error text-sm">Content is required</p>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-secondary w-full mt-5"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <span className="loading loading-spinner"></span>
              )}
              {!isSubmitting && "Submit"}
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
