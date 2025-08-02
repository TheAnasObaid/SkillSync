"use client";

import apiClient from "@/lib/apiClient";
import { IUser } from "@/types";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiEdit, FiX } from "react-icons/fi";
import FormCard from "../Common/FormCard";
import { TextInput } from "../Forms/FormFields";
import ProfileView from "../Profile/ProfileView";

interface Props {
  initialUser: IUser;
}

interface AdminProfileFormData {
  name: string;
  profile: { lastName: string };
}

const AdminProfileClient = ({ initialUser }: Props) => {
  const [user, setUser] = useState<IUser>(initialUser);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const formMethods = useForm<AdminProfileFormData>();
  const { reset, handleSubmit } = formMethods;

  useEffect(() => {
    if (isEditMode && user) {
      reset({
        name: user.profile.firstName,
        profile: { lastName: user.profile.lastName || "" },
      });
    }
  }, [isEditMode, user, reset]);

  const handleFormSubmit: SubmitHandler<AdminProfileFormData> = async (
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

    try {
      const response = await apiClient.post("/users/upload-avatar", formData);
      setUser({
        ...user!,
        profile: { ...user!.profile!, avatar: response.data.avatarUrl },
      });
      toast.success("Avatar updated successfully!");
    } catch (error) {
      toast.error("Failed to upload avatar.");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">My Profile</h2>
        <button
          className="btn btn-ghost"
          onClick={() => setIsEditMode((p) => !p)}
        >
          {isEditMode ? (
            <>
              <FiX /> Cancel
            </>
          ) : (
            <>
              <FiEdit /> Edit Profile
            </>
          )}
        </button>
      </div>

      {isEditMode ? (
        <FormProvider {...formMethods}>
          <FormCard
            onSubmit={handleSubmit(handleFormSubmit)}
            isSubmitting={isSubmitting}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <TextInput name="name" label="First Name" />
              <TextInput name="profile.lastName" label="Last Name" />
            </div>
          </FormCard>
        </FormProvider>
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
            accept="image/*"
          />
        </>
      )}
    </>
  );
};

export default AdminProfileClient;
