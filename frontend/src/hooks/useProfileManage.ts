"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { IUser, DeveloperProfileFormData } from "@/types";
import apiClient from "@/lib/apiClient";
import toast from "react-hot-toast";

export const useProfileManager = (initialUser: IUser) => {
  const [user, setUser] = useState<IUser>(initialUser);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const formMethods = useForm<DeveloperProfileFormData>();
  const { reset, handleSubmit } = formMethods;

  // Effect to pre-fill the form when entering edit mode
  useEffect(() => {
    if (isEditMode && user) {
      // This reset logic should be adapted for each profile type
      // We'll pass the specific values from the component.
    }
  }, [isEditMode, user, reset]);

  const handleFormSubmit: SubmitHandler<DeveloperProfileFormData> = async (
    data
  ) => {
    const toastId = toast.loading("Updating profile...");
    setIsSubmitting(true);
    try {
      const response = await apiClient.put<IUser>("/users/me", data);
      setUser(response.data);
      toast.success("Profile updated!", { id: toastId });
      setIsEditMode(false);
    } catch (error) {
      toast.error("Failed to update profile.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const toastId = toast.loading("Uploading avatar...");
    try {
      const response = await apiClient.post("/users/me/avatar", formData);
      setUser((prev) => ({
        ...prev!,
        profile: { ...prev!.profile, avatar: response.data.avatarUrl },
      }));
      toast.success("Avatar updated!", { id: toastId });
    } catch (error) {
      toast.error("Failed to upload avatar.");
    }
  };

  return {
    user,
    isEditMode,
    setIsEditMode,
    isSubmitting,
    avatarInputRef,
    formMethods,
    handleFormSubmit: handleSubmit(handleFormSubmit),
    handleAvatarUpload,
  };
};
