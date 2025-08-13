"use client";

import apiClient from "@/lib/apiClient";
import {
  ChallengeDto,
  ChallengeFormValues,
  challengeApiSchema,
  challengeFormSchema,
} from "@/lib/validationSchemas";
import { IChallenge } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

export const useChallengeForm = (
  isEditing = false,
  existingChallenge?: IChallenge
) => {
  const router = useRouter();

  const form = useForm<ChallengeFormValues>({
    resolver: zodResolver(challengeFormSchema),
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
          prize: existingChallenge?.prize?.toString() || "0",
          tags: (existingChallenge?.tags || []).join(", "),
        }
      : {
          difficulty: "beginner",
          title: "",
          description: "",
          requirements: "",
          category: "",
          tags: "",
          prize: "0",
          deadline: "",
        },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<ChallengeFormValues> = async (data) => {
    const transformedData: ChallengeDto = challengeApiSchema.parse(data);

    const formData = new FormData();
    Object.entries(transformedData).forEach(([key, value]) => {
      if (key !== "file") {
        formData.append(key, String(value));
      }
    });

    if (data.file && data.file.length > 0) {
      formData.append("file", data.file[0]);
    }

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

  return {
    form,
    isSubmitting,
    submitHandler: handleSubmit(onSubmit),
  };
};
