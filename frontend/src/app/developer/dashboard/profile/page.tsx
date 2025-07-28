"use client";

import DashboardLayout, {
  DashboardLink,
} from "@/components/Layout/DashboardLayout";
import ProfileEditForm from "@/components/Profile/ProfileEditForm";
import ProfileView from "@/components/Profile/ProfileView";
import apiClient from "@/services/apiClient";
import { User } from "@/store/authStore";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { FiBriefcase, FiEdit, FiUser, FiX } from "react-icons/fi";

export interface ProfileFormData {
  name: string;
  email: string;
  profile: {
    lastName: string;
    bio: string;
    skills: string;
  };
}

const developerSidebarLinks: DashboardLink[] = [
  {
    href: "/developer/dashboard",
    label: "My Submissions",
    icon: <FiBriefcase />,
  },
  {
    href: "/developer/dashboard/profile",
    label: "My Profile",
    icon: <FiUser />,
  },
];

const DeveloperProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<User>("/users/profile");
        setUser(response.data);
      } catch (err) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleFormSubmit = async (data: ProfileFormData) => {
    setError("");
    setIsSubmitting(true);
    try {
      const updatePayload = {
        ...data,
        profile: {
          ...data.profile,
          skills: data.profile.skills.split(",").map((skill) => skill.trim()),
        },
      };
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

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <DashboardLayout sidebarLinks={developerSidebarLinks}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">My Profile</h2>
        {/* The button to toggle edit mode */}
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

      {/* Conditional rendering based on the edit mode state */}
      {isEditMode ? (
        <ProfileEditForm
          // We create default values from our user state
          defaultValues={{
            name: user?.profile?.firstName || "",
            email: user?.email || "",
            profile: {
              lastName: user?.profile?.lastName || "",
              bio: user?.profile?.bio || "",
              skills: user?.profile?.skills.join(", ") || "",
            },
          }}
          onFormSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
        />
      ) : (
        <ProfileView user={user} />
      )}
    </DashboardLayout>
  );
};

export default DeveloperProfilePage;
