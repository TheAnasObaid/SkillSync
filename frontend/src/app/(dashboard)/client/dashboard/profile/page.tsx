// ===== File: frontend\src\app\(dashboard)\client\dashboard\profile\page.tsx =====
"use client";

import { TextInput, Textarea } from "@/components/Forms/FormFields";
import ProfileView from "@/components/Profile/ProfileView";
import apiClient from "@/lib/apiClient";
import { IUser } from "@/types";
import { AxiosError } from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiEdit, FiX } from "react-icons/fi";
import FormCard from "@/components/Common/FormCard";

interface ClientProfileFormData {
  name: string;
  profile: {
    lastName: string;
    companyName: string;
    bio: string;
  };
}

function ClientProfilePage() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const formMethods = useForm<ClientProfileFormData>();
  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = formMethods;

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<IUser>("/users/me");
        setUser(response.data);
      } catch (err) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const toastId = toast.loading("Uploading avatar...");
    try {
      const response = await apiClient.post("/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser((prevUser) =>
        prevUser
          ? {
              ...prevUser,
              profile: {
                ...prevUser.profile!,
                avatar: response.data.avatarUrl,
              },
            }
          : null
      );
      toast.success("Avatar updated successfully!", { id: toastId });
    } catch (error) {
      toast.error("Failed to upload avatar.", { id: toastId });
    }
  };

  const handleFormSubmit = async (data: ClientProfileFormData) => {
    setError("");
    setIsSubmitting(true);
    const toastId = toast.loading("Updating profile...");
    try {
      const updatePayload = {
        name: data.name,
        profile: data.profile,
      };
      const response = await apiClient.put<IUser>("/users/me", updatePayload);
      setUser(response.data);
      setIsEditMode(false);
      toast.success("Profile updated successfully!", { id: toastId });
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data.message || "Failed to update profile.");
      }
      toast.error("Failed to update profile.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isEditMode && user) {
      reset({
        name: user.profile?.firstName || "",
        profile: {
          lastName: user.profile?.lastName || "",
          companyName: user.profile?.companyName || "",
          bio: user.profile?.bio || "",
        },
      });
    }
  }, [isEditMode, user, reset]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Client Profile</h2>
        <button
          className="btn btn-ghost"
          onClick={() => setIsEditMode(!isEditMode)}
        >
          {isEditMode ? (
            <>
              <FiX className="mr-2" /> Cancel
            </>
          ) : (
            <>
              <FiEdit className="mr-2" /> Edit Profile
            </>
          )}
        </button>
      </div>

      {error && <div className="alert alert-error mb-6">{error}</div>}

      {isEditMode && user ? (
        <FormProvider {...formMethods}>
          <FormCard
            onSubmit={handleSubmit(handleFormSubmit)}
            isSubmitting={isSubmitting}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <TextInput name="name" label="First Name" />
              <TextInput name="profile.lastName" label="Last Name" />
            </div>
            <TextInput name="profile.companyName" label="Company Name" />
            <Textarea name="profile.bio" label="Bio / Company Details" />
          </FormCard>
        </FormProvider>
      ) : loading ? (
        <div className="flex justify-center p-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <ProfileView
            user={user}
            onAvatarClick={() => avatarInputRef.current?.click()}
          />
          <input
            type="file"
            ref={avatarInputRef}
            onChange={handleAvatarUpload}
            className="hidden"
            accept="image/png, image/jpeg, image/gif"
          />
        </>
      )}
    </>
  );
}

export default ClientProfilePage;
