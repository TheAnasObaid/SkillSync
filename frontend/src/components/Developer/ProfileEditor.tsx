"use client";

import { useEffect } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { TextInput, Textarea, Select } from "@/components/Forms/FormFields";
import { IUser, ProfileFormData } from "@/types";
import FormCard from "../Common/FormCard";

interface Props {
  currentUser: IUser;
  onSubmit: SubmitHandler<ProfileFormData>;
  isSubmitting: boolean;
}

const ProfileEditor = ({ currentUser, onSubmit, isSubmitting }: Props) => {
  const formMethods = useForm<ProfileFormData>();
  const { handleSubmit, reset } = formMethods;

  useEffect(() => {
    if (currentUser) {
      reset({
        name: currentUser.profile.firstName,
        email: currentUser.email,
        profile: {
          lastName: currentUser.profile.lastName || "",
          bio: currentUser.profile.bio || "",
          skills: (currentUser.profile.skills || []).join(", "),
          experience: currentUser.profile.experience || "",
        },
      });
    }
  }, [currentUser, reset]);

  return (
    <FormProvider {...formMethods}>
      <FormCard onSubmit={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput name="name" label="First Name" />
          <TextInput name="profile.lastName" label="Last Name" />
        </div>
        <TextInput name="email" label="Email Address" />
        <Textarea name="profile.bio" label="Bio" rows={4} />
        <TextInput
          name="profile.skills"
          label="Skills"
          helperText="Enter skills separated by commas."
        />
        <Select name="profile.experience" label="Experience Level">
          <option value="">Select Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Expert">Expert</option>
        </Select>
      </FormCard>
    </FormProvider>
  );
};

export default ProfileEditor;
