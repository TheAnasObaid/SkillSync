"use client";

import {
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} from "@/hooks/mutations/useProfileMutations";
import { useMyProfileQuery } from "@/hooks/queries/useUserQueries";
import { ClientProfileFormData } from "@/types";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FiEdit, FiX } from "react-icons/fi";

import FormCard from "@/components/Common/FormCard";
import { TextInput, Textarea } from "@/components/Forms/FormFields";
import ProfileView from "@/components/Profile/ProfileView";

const ClientProfilePage = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const { data: user, isLoading, isError } = useMyProfileQuery();
  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateProfileMutation();
  const { mutate: uploadAvatar, isPending: isUploadingAvatar } =
    useUploadAvatarMutation();

  const formMethods = useForm<ClientProfileFormData>();

  useEffect(() => {
    if (user && isEditMode) {
      formMethods.reset({
        name: user.profile.firstName,
        profile: {
          lastName: user.profile.lastName || "",
          companyName: user.profile.companyName || "",
          bio: user.profile.bio || "",
        },
      });
    }
  }, [user, isEditMode, formMethods.reset]);

  const handleFormSubmit: SubmitHandler<ClientProfileFormData> = (data) => {
    updateProfile(data, { onSuccess: () => setIsEditMode(false) });
  };

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    uploadAvatar(formData);
  };

  if (isLoading) return <div className="skeleton h-96 w-full"></div>;
  if (isError || !user)
    return <div className="alert alert-error">Could not load profile.</div>;

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
            <TextInput name="profile.companyName" label="Company Name" />
            <Textarea name="profile.bio" label="Bio / Company Details" />
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
            disabled={isUploadingAvatar}
          />
        </>
      )}
    </>
  );
};

export default ClientProfilePage;
