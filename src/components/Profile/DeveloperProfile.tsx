"use client";

import {
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} from "@/hooks/mutations/useProfileMutations";
import { useMyProfileQuery } from "@/hooks/queries/useUserQueries";
import { DeveloperProfileFormData } from "@/types";
import { ChangeEvent, useRef, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { FiEdit, FiX } from "react-icons/fi";
import ProfileEditor from "../Developer/ProfileEditor";
import PortfolioManager from "./PortfolioManager";
import ProfileView from "./ProfileView";

const DeveloperProfile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const { data: user, isLoading, isError } = useMyProfileQuery();

  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateProfileMutation();
  const { mutate: uploadAvatar, isPending: isUploadingAvatar } =
    useUploadAvatarMutation();

  const handleProfileUpdate: SubmitHandler<DeveloperProfileFormData> = (
    data
  ) => {
    const payload = {
      ...data,
      profile: {
        ...data.profile,
        skills: data.profile.skills.split(",").map((s) => s.trim()),
      },
    };
    updateProfile(payload, { onSuccess: () => setIsEditMode(false) });
  };

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    uploadAvatar(formData);
  };

  if (isLoading) return <div className="skeleton h-96 w-full"></div>;
  if (isError || !user)
    return <div className="alert alert-error">Could not load profile.</div>;

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
            isSubmitting={isUpdating}
          />
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
              accept="image/*"
              disabled={isUploadingAvatar}
            />
          </>
        )}
      </section>

      <section>
        <PortfolioManager initialPortfolio={user.profile.portfolio} />
      </section>
    </div>
  );
};

export default DeveloperProfile;
