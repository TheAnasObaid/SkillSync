"use client";

import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { IUser, IIPortfolioItem, ProfileFormData } from "@/types";
import toast from "react-hot-toast";
import apiClient from "@/lib/apiClient";

import ProfileView from "../Profile/ProfileView";
import PortfolioManager from "./PortfolioManager";
import { FiEdit, FiX } from "react-icons/fi";
import ProfileEditor from "../Developer/ProfileEditor";

const DeveloperProfile = ({ initialUser }: { initialUser: IUser }) => {
  const [user, setUser] = useState<IUser>(initialUser);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // The form hook has been removed from this component.

  const handleProfileUpdate: SubmitHandler<ProfileFormData> = async (data) => {
    const toastId = toast.loading("Updating profile...");
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        profile: {
          ...data.profile,
          skills: data.profile.skills.split(",").map((s) => s.trim()),
        },
      };
      const response = await apiClient.put<IUser>("/users/me", payload);
      setUser(response.data);
      toast.success("Profile updated!", { id: toastId });
      setIsEditMode(false);
    } catch (error) {
      toast.error("Failed to update profile.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPortfolioUpdate = (updatedPortfolio: IIPortfolioItem[]) => {
    setUser((prev) => ({
      ...prev!,
      profile: { ...prev!.profile, portfolio: updatedPortfolio },
    }));
  };

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
          <ProfileEditor
            currentUser={user}
            onSubmit={handleProfileUpdate}
            isSubmitting={isSubmitting}
          />
        ) : (
          <ProfileView user={user} />
        )}
      </section>

      <section>
        <PortfolioManager
          initialPortfolio={user.profile.portfolio}
          onPortfolioUpdate={onPortfolioUpdate}
        />
      </section>
    </div>
  );
};

export default DeveloperProfile;
