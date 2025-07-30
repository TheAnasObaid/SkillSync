"use client";

import ConfirmationModal from "@/components/Common/ConfirmationModal";
import DashboardLayout, {
  DashboardLink,
} from "@/components/Layout/DashboardLayout";
import PortfolioCard, {
  PortfolioItem,
} from "@/components/Profile/PortfolioCard";
import ProfileEditForm from "@/components/Profile/ProfileEditForm";
import ProfileView from "@/components/Profile/ProfileView";
import apiClient from "@/services/apiClient";
import { User, useAuthStore } from "@/store/authStore";
import { AxiosError } from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit, FiPlus, FiUser, FiX } from "react-icons/fi";
import { TbBriefcase2 } from "react-icons/tb";

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
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ isOpen: false, title: "", message: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>();

  const {
    register: registerPortfolio,
    handleSubmit: handlePortfolioSubmit,
    reset: resetPortfolio,
    formState: { errors: portfolioErrors, isSubmitting: isPortfolioSubmitting },
  } = useForm<PortfolioItem>();

  useEffect(() => {
    // When the user data is loaded, set the portfolio state
    if (user?.profile?.portfolio) {
      setPortfolio(user.profile.portfolio);
    }
  }, [user]);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
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

  const handleAddPortfolioItem = async (data: PortfolioItem) => {
    const newItem = {
      ...data,
      imageUrl: "https://placehold.co/600x400/1a1a1a/ffffff?text=Project",
    };
    try {
      const response = await apiClient.post<PortfolioItem[]>(
        "/users/profile/portfolio",
        newItem
      );
      const updatedPortfolio = response.data;
      setPortfolio(updatedPortfolio);
      setUser({
        ...user!,
        profile: { ...user!.profile!, portfolio: updatedPortfolio },
      });
      setIsPortfolioModalOpen(false);
      resetPortfolio();
    } catch (err) {
      alert("Failed to add project.");
    }
  };

  const handleDeletePortfolioItem = (item: PortfolioItem) => {
    setModalState({
      isOpen: true,
      title: "Delete Project",
      message: `Are you sure you want to permanently delete your project "${item.title}"? This action cannot be undone.`,
      // The onConfirm function will now contain the API call
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          await apiClient.delete(`/users/profile/portfolio/${item._id}`);
          const updatedPortfolio = portfolio.filter((p) => p._id !== item._id);
          setPortfolio(updatedPortfolio);
          setUser({
            ...user!,
            profile: { ...user!.profile!, portfolio: updatedPortfolio },
          });
        } catch (err) {
          alert("Failed to delete project.");
        } finally {
          setIsDeleting(false);
          setModalState({ isOpen: false, title: "", message: "" }); // Close modal
        }
      },
    });
  };

  const handleCancelModal = () => {
    setModalState({ isOpen: false, title: "", message: "" });
  };

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
          skills: (user.profile?.skills || []).join(", "),
        },
      });
    }
  }, [isEditMode, user, reset]);

  if (!hasMounted || !user) {
    return <span className="loading loading-spinner loading-lg" />;
  }

  return (
    <>
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
          <ProfileEditForm
            onSubmit={handleSubmit(handleFormSubmit)}
            isSubmitting={isSubmitting}
          >
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
                <legend className="fieldset-legend">Email Address</legend>
                <input
                  type="email"
                  className="input w-full bg-transparent focus:outline-none"
                  {...register("email", { required: "Email is required" })}
                />
              </fieldset>
              {errors.email && (
                <p className="text-error text-xs mt-1">
                  {errors.email.message}
                </p>
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

        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Portfolio</h2>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIsPortfolioModalOpen(true)}
            >
              <FiPlus /> Add Project
            </button>
          </div>
          {portfolio.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map((item) => (
                <PortfolioCard
                  key={item._id}
                  item={item}
                  onDelete={() => handleDeletePortfolioItem(item)} // Pass the item to the handler
                  isOwner={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-base-200/50 border border-dashed border-base-300 rounded-lg">
              <p className="text-base-content/60">
                Your portfolio is empty. Add a project to showcase your skills!
              </p>
            </div>
          )}
        </div>
      </DashboardLayout>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        onConfirm={modalState.onConfirm!}
        onCancel={handleCancelModal}
        confirmText="Yes, Delete"
        confirmButtonClass="btn-error"
        isActionInProgress={isDeleting}
      />

      <dialog className={`modal ${isPortfolioModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box border border-base-300">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setIsPortfolioModalOpen(false)}
          >
            ✕
          </button>
          <h3 className="font-bold text-lg mb-4">Add New Portfolio Project</h3>
          <form
            onSubmit={handlePortfolioSubmit(handleAddPortfolioItem)}
            className="space-y-4"
          >
            <div className="grid gap-2">
              <label className="label text-sm">Project Title</label>
              <input
                type="text"
                className="input input-bordered w-full"
                {...registerPortfolio("title", { required: true })}
              />
            </div>
            <div className="grid gap-2">
              <label className="label text-sm">Description</label>
              <textarea
                className="textarea textarea-bordered w-full"
                {...registerPortfolio("description", { required: true })}
              ></textarea>
            </div>
            <div className="grid gap-2">
              <label className="label text-sm">Live URL (Optional)</label>
              <input
                type="url"
                className="input input-bordered w-full"
                {...registerPortfolio("liveUrl")}
              />
            </div>
            <div className="grid gap-2">
              <label className="label text-sm">GitHub URL (Optional)</label>
              <input
                type="url"
                className="input input-bordered w-full"
                {...registerPortfolio("githubUrl")}
              />
            </div>
            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isPortfolioSubmitting}
              >
                {isPortfolioSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Add Project"
                )}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsPortfolioModalOpen(false)}>close</button>
        </form>
      </dialog>
    </>
  );
};

export default DeveloperProfilePage;
