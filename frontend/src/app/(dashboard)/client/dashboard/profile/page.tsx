"use client";

import ProfileView from "@/components/Profile/ProfileView";
import apiClient from "@/lib/apiClient";
import { IUser } from "@/types";
import { AxiosError } from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit, FiX } from "react-icons/fi";

interface ClientProfileFormData {
  name: string;
  profile: {
    lastName: string;
    companyName: string;
    bio: string;
  };
}

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
    formData.append("file", file);

    try {
      const response = await apiClient.post("/users/me/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
      const response = await apiClient.put<IUser>("/users/me", updatePayload);
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

      {error && <div className="alert alert-error mb-6">{error}</div>}

      {isEditMode ? (
        <div>Form here</div>
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
    </>
  );
}

export default ClientProfilePage;
