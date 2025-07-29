"use client";

import DashboardLayout, {
  DashboardLink,
} from "@/components/Layout/DashboardLayout";
import ProfileEditForm from "@/components/Profile/ProfileEditForm";
import ProfileView from "@/components/Profile/ProfileView";
import apiClient from "@/services/apiClient";
import { User, useAuthStore } from "@/store/authStore";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit, FiUser, FiX } from "react-icons/fi";
import { TbBriefcase2 } from "react-icons/tb";

// This interface now lives in the page, specific to the developer's form
export interface ProfileFormData {
  name: string;
  email: string;
  profile: {
    lastName: string;
    bio: string;
    skills: string; // Use a string for the input field
  };
}

const developerSidebarLinks: DashboardLink[] = [
  {
    href: "/developer/dashboard",
    label: "My Submissions",
    icon: <TbBriefcase2 />,
  },
  {
    href: "/developer/dashboard/profile",
    label: "My Profile",
    icon: <FiUser />,
  },
];

const DeveloperProfilePage = () => {
  const { user, setUser } = useAuthStore();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // The useForm hook is now managed by the parent page
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>();

  const handleFormSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    setError("");
    try {
      // Prepare the payload for the API
      const updatePayload = {
        ...data,
        profile: {
          ...data.profile,
          skills: data.profile.skills.split(",").map((s) => s.trim()), // Convert string to array
        },
      };

      const response = await apiClient.put<User>(
        "/users/profile",
        updatePayload
      );
      setUser(response.data); // Update global state
      setIsEditMode(false);
    } catch (err) {
      setError(
        err instanceof AxiosError
          ? err.response?.data.message
          : "Failed to update profile."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set default form values when entering edit mode
  useEffect(() => {
    if (isEditMode && user) {
      reset({
        name: user.profile?.firstName || "",
        email: user.email || "",
        profile: {
          lastName: user.profile?.lastName || "",
          bio: user.profile?.bio || "",
          skills: (user.profile?.skills || []).join(", "), // Convert array to string
        },
      });
    }
  }, [isEditMode, user, reset]);

  if (!user)
    return (
      <div className="text-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <DashboardLayout sidebarLinks={developerSidebarLinks}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Developer Profile</h2>
        <button
          className="btn btn-ghost"
          onClick={() => setIsEditMode(!isEditMode)}
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

      {error && <div className="alert alert-error mb-6">{error}</div>}

      {isEditMode ? (
        // Use the new reusable form and pass the unique fields as children
        <ProfileEditForm
          onSubmit={handleSubmit(handleFormSubmit)}
          isSubmitting={isSubmitting}
        >
          {/* These fields are specific to the Developer */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">First Name</legend>
                <input
                  type="text"
                  className="input w-full bg-transparent focus:outline-none"
                  {...register("name", { required: "First name is required" })}
                />
              </fieldset>
              {errors.name && (
                <p className="text-error text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Last Name</legend>
                <input
                  type="text"
                  className="input w-full bg-transparent focus:outline-none"
                  {...register("profile.lastName")}
                />
              </fieldset>
            </div>
          </div>
          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email Address</legend>
              <input
                type="email"
                className="input w-full bg-transparent focus:outline-none"
                {...register("email", { required: "Email is required" })}
              />
            </fieldset>
            {errors.email && (
              <p className="text-error text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Bio</legend>
              <textarea
                className="textarea w-full bg-transparent focus:outline-none h-24"
                {...register("profile.bio")}
              ></textarea>
            </fieldset>
          </div>
          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Skills</legend>
              <input
                type="text"
                className="input w-full bg-transparent focus:outline-none"
                placeholder="React, Node.js, Python"
                {...register("profile.skills")}
              />
            </fieldset>
            <p className="text-xs text-base-content/60 mt-2">
              Enter skills separated by commas.
            </p>
          </div>
        </ProfileEditForm>
      ) : (
        <ProfileView user={user} />
      )}
    </DashboardLayout>
  );
};

export default DeveloperProfilePage;
