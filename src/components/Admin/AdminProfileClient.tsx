"use client";

import {
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} from "@/hooks/mutations/useProfileMutations";
import { useMyProfileQuery } from "@/hooks/queries/useUserQueries";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FiEdit, FiX } from "react-icons/fi";
import FormCard from "../Common/FormCard";
import { TextInput } from "../Forms/FormFields";
import ProfileView from "../Profile/ProfileView";

interface AdminProfileFormData {
  firstName: string;
  lastName: string;
}

const AdminProfileClient = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const { data: user, isLoading, isError } = useMyProfileQuery();

  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateProfileMutation();
  const { mutate: uploadAvatar, isPending: isUploading } =
    useUploadAvatarMutation();

  const formMethods = useForm<AdminProfileFormData>();

  useEffect(() => {
    if (user && isEditMode) {
      formMethods.reset({
        firstName: user.firstName,
        lastName: user.lastName || "",
      });
    }
  }, [user, isEditMode, formMethods]);

  const handleFormSubmit: SubmitHandler<AdminProfileFormData> = (data) => {
    updateProfile(data, {
      onSuccess: () => setIsEditMode(false),
    });
  };

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    uploadAvatar(formData);
  };

  // 3. RENDER STATES
  if (isLoading) return <div className="skeleton h-64 w-full"></div>;
  if (isError || !user)
    return (
      <div className="alert alert-error">Could not load your profile.</div>
    );

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
            onSubmit={formMethods.handleSubmit(handleFormSubmit)}
            isSubmitting={isUpdating}
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
            disabled={isUploading}
          />
        </>
      )}
    </>
  );
};

export default AdminProfileClient;
