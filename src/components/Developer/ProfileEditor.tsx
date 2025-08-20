"use client";

import { Select, TextInput, Textarea } from "@/components/Forms/FormFields";
import { User } from "@prisma/client";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import FormCard from "../Common/FormCard";

export interface DeveloperProfileFormData {
  firstName: string;
  lastName: string;
  bio: string;
  skills: string;
  experience: string;
}

interface Props {
  currentUser: User;
  onSubmit: SubmitHandler<DeveloperProfileFormData>;
  isSubmitting: boolean;
}

const ProfileEditor = ({ currentUser, onSubmit, isSubmitting }: Props) => {
  const formMethods = useForm<DeveloperProfileFormData>();
  const { handleSubmit, reset } = formMethods;

  useEffect(() => {
    if (currentUser) {
      reset({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        bio: currentUser.bio || "",
        skills: (currentUser.skills || []).join(", "),
        experience: currentUser.experience || "",
      });
    }
  }, [currentUser, reset]);

  return (
    <FormProvider {...formMethods}>
      <FormCard onSubmit={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
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
  );
};

export default ProfileEditor;
