"use client";

import apiClient from "@/lib/apiClient";
import { DeveloperProfileFormData, IPortfolioItem, IUser } from "@/types";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { FiEdit, FiX } from "react-icons/fi";
import ProfileEditor from "../Developer/ProfileEditor";
import ProfileView from "../Profile/ProfileView";
import PortfolioManager from "./PortfolioManager";

const DeveloperProfile = ({ initialUser }: { initialUser: IUser }) => {
  const [user, setUser] = useState<IUser>(initialUser);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileUpdate: SubmitHandler<DeveloperProfileFormData> = async (
    data
  ) => {
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

  const onPortfolioUpdate = (updatedPortfolio: IPortfolioItem[]) => {
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
