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
import { Select, TextInput, Textarea } from "../Forms/FormFields";
import PortfolioManager from "./PortfolioManager";
import ProfileView from "./ProfileView";

interface DeveloperProfileFormData {
  firstName: string;
  lastName: string;
  bio: string;
  skills: string; // The form will handle a comma-separated string
  experience: string;
}

const DeveloperProfile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const { data: user, isLoading, isError } = useMyProfileQuery();
  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateProfileMutation();
  const { mutate: uploadAvatar, isPending: isUploadingAvatar } =
    useUploadAvatarMutation();

  const formMethods = useForm<DeveloperProfileFormData>();

  useEffect(() => {
    if (user && isEditMode) {
      formMethods.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        skills: (user.skills || []).join(", "),
        experience: user.experience || "",
      });
    }
  }, [user, isEditMode, formMethods]);

  const handleProfileUpdate: SubmitHandler<DeveloperProfileFormData> = (
    data
  ) => {
    // Transform the comma-separated skills string back into an array for the API
    const payload = {
      ...data,
      skills: data.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    updateProfile(payload, { onSuccess: () => setIsEditMode(false) });
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
    <div className="space-y-12">
      <section>
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
              onSubmit={formMethods.handleSubmit(handleProfileUpdate)}
              isSubmitting={isUpdating}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput name="firstName" label="First Name" />
                <TextInput name="lastName" label="Last Name" />
              </div>
              <Textarea name="bio" label="Bio" rows={4} />
              <TextInput
                name="skills"
                label="Skills"
                helperText="Enter skills separated by commas."
              />
              <Select name="experience" label="Experience Level">
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </Select>
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
      </section>

      <section>
        <PortfolioManager />
      </section>
    </div>
  );
};

export default DeveloperProfile;
