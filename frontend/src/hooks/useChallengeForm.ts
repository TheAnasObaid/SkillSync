"use client";

import apiClient from "@/lib/apiClient";
import { ChallengeFormData, challengeSchema } from "@/lib/validationSchemas";
import { IChallenge } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export const useChallengeForm = (
  isEditing = false,
  existingChallenge?: IChallenge
) => {
  const router = useRouter();

  const form = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: isEditing
      ? {
          title: existingChallenge?.title || "",
          description: existingChallenge?.description || "",
          requirements: existingChallenge?.requirements || "",
          category: existingChallenge?.category || "",
          difficulty: existingChallenge?.difficulty || "beginner",
          deadline: existingChallenge?.deadline
            ? new Date(existingChallenge.deadline).toISOString().split("T")[0]
            : "",
          prize: existingChallenge?.prize || "0",
          tags: (existingChallenge?.tags || []).join(", "),
        }
      : {},
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: ChallengeFormData) => {
    const formData = new FormData();

    const toastId = toast.loading(
      isEditing ? "Updating challenge..." : "Creating challenge..."
    );

    try {
      if (isEditing) {
        await apiClient.put(`/challenges/${existingChallenge?._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Challenge updated!", { id: toastId });
        router.push("/client/dashboard/challenges");
      } else {
        await apiClient.post("/challenges", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Challenge created!", { id: toastId });
        router.push("/client/dashboard");
      }
      router.refresh();
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        (isEditing ? "Update failed." : "Creation failed.");
      toast.error(message, { id: toastId });
    }
  };

  return { form, isSubmitting, onSubmit };
};
