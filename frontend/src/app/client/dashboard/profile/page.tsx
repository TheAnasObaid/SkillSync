"use client";

import DashboardLayout, {
  DashboardLink,
} from "@/components/Layout/DashboardLayout";
import ProfileView from "@/components/Profile/ProfileView";
import apiClient from "@/services/apiClient";
import { User } from "@/store/authStore";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsGrid } from "react-icons/bs";
import { FiEdit, FiUser, FiX } from "react-icons/fi";
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
  { href: "/client/dashboard", label: "My Challenges", icon: <BsGrid /> },
  {
    href: "/client/dashboard/create",
    label: "Create Challenge",
    icon: <GoPlusCircle />,
  },
  { href: "/client/dashboard/profile", label: "My Profile", icon: <FiUser /> },
];

const ClientProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

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

  const handleFormSubmit = async (data: ClientProfileFormData) => {
    setError("");
    setIsSubmitting(true);
    try {
      // The payload is simpler for the client
      const updatePayload = {
        name: data.name,
        profile: data.profile,
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

  // When entering edit mode, pre-fill the form with the current user data
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

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

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
        // --- THE EDIT FORM ---
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
        <ProfileView user={user} />
      )}
    </DashboardLayout>
  );
};

export default ClientProfilePage;
