"use client";

import FormCard from "@/components/Common/FormCard";
import { TextInput, Textarea } from "@/components/Forms/FormFields";
import ProfileView from "@/components/Profile/ProfileView";
import {
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} from "@/hooks/mutations/useProfileMutations";
import { useMyProfileQuery } from "@/hooks/queries/useUserQueries";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FiEdit, FiX } from "react-icons/fi";

// 1. Define the form's data shape directly in the component.
//    This matches the flattened fields in our Prisma schema.
interface ClientProfileFormData {
  firstName: string;
  lastName: string;
  companyName: string;
  bio: string;
}

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
      // 2. Reset the form using the flattened properties from the Prisma User object.
      formMethods.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        companyName: user.companyName || "",
        bio: user.bio || "",
      });
    }
  }, [user, isEditMode, formMethods]); // formMethods was missing from dependency array

  const handleFormSubmit: SubmitHandler<ClientProfileFormData> = (data) => {
    // The `data` object from the form now perfectly matches the shape our API expects.
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
        <h2 className="text-3xl font-bold">My Profile</h2>
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
              <TextInput name="firstName" label="First Name" />
              <TextInput name="lastName" label="Last Name" />
            </div>
            <TextInput name="companyName" label="Company Name" />
            <Textarea name="bio" label="Bio / Company Details" />
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
