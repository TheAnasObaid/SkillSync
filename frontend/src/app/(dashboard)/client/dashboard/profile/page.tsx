"use client";

import DashboardLayout from "@/components/Layout/DashboardLayout";
import ProfileEditForm from "@/components/Profile/ProfileEditForm";
import ProfileView from "@/components/Profile/ProfileView";
import { DashboardLink } from "@/config/dashboard";
import apiClient from "@/lib/apiClient";
import { IUser } from "@/types";
import { AxiosError } from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { BsGrid } from "react-icons/bs";
import { FiArchive, FiEdit, FiUser, FiX } from "react-icons/fi";
import { GoPlusCircle } from "react-icons/go";

interface ClientProfileFormData {
  name: string;
  profile: {
    lastName: string;
    companyName: string;
    bio: string;
  };
}

const clientSidebarLinks: DashboardLink[] = [
  { href: "/client/dashboard", label: "Dashboard", icon: <BsGrid /> },
  {
    href: "/client/dashboard/challenges",
    label: "My Challenges",
    icon: <FiArchive />,
  },
  {
    href: "/client/dashboard/create",
    label: "Create Challenge",
    icon: <GoPlusCircle />,
  },
  { href: "/client/dashboard/profile", label: "My Profile", icon: <FiUser /> },
];

function ClientProfilePage() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientProfileFormData>();

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
    formData.append("file", file); // 'file' must match the name in the multer config

    try {
      const response = await apiClient.post("/users/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Update the user in the global store to reflect the new avatar
      setUser({
        ...user!,
        profile: { ...user!.profile!, avatar: response.data.avatarUrl },
      });
      alert("Avatar updated successfully!");
    } catch (error) {
      alert("Failed to upload avatar.");
    }
  };

  const handleFormSubmit = async (data: ClientProfileFormData) => {
    setError("");
    setIsSubmitting(true);
    try {
      const updatePayload = {
        name: data.name,
        profile: data.profile,
      };
      const response = await apiClient.put<IUser>(
        "/users/profile",
        updatePayload
      );
      setUser(response.data);
      setIsEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data.message || "Failed to update profile.");
      }
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
    <DashboardLayout sidebarLinks={clientSidebarLinks}>
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

      {isEditMode ? (
        <ProfileEditForm
          onSubmit={handleSubmit(handleFormSubmit)}
          isSubmitting={isSubmitting}
        >
          {/* These are the specific fields for the CLIENT role */}
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
              <legend className="fieldset-legend">Company Name</legend>
              <input
                type="text"
                className="input w-full bg-transparent focus:outline-none"
                {...register("profile.companyName")}
              />
            </fieldset>
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
        </ProfileEditForm>
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
    </DashboardLayout>
  );
}

export default ClientProfilePage;
