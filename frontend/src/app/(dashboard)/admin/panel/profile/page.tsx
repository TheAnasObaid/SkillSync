"use client";

import DashboardLayout, {
  DashboardLink,
} from "@/components/Layout/DashboardLayout";
import ProfileView from "@/components/Profile/ProfileView";
import { adminSidebarLinks } from "@/config/dashboard";
import apiClient from "@/lib/apiClient";
import { User } from "@/store/authStore";
import { AxiosError } from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FiClipboard, FiEdit, FiGrid, FiUser, FiX } from "react-icons/fi";

interface AdminProfileFormData {
  name: string;
  profile: {
    lastName: string;
  };
}

const AdminProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
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
  } = useForm<AdminProfileFormData>();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<User>("/users/me");
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

  const handleFormSubmit = async (data: AdminProfileFormData) => {
    setError("");
    setIsSubmitting(true);
    try {
      const updatePayload = { name: data.name, profile: data.profile };
      const response = await apiClient.put<User>(
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
        },
      });
    }
  }, [isEditMode, user, reset]);

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <DashboardLayout sidebarLinks={adminSidebarLinks}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Admin Profile</h2>
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
        <div className="card bg-base-200/50 border border-base-300 p-8">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">First Name</legend>
                  <input
                    type="text"
                    className="input w-full bg-transparent focus:outline-none"
                    {...register("name", {
                      required: "First name is required",
                    })}
                  />
                </fieldset>
                {errors.name && (
                  <p className="text-error text-xs mt-1">
                    {errors.name.message}
                  </p>
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
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
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
};

export default AdminProfilePage;
