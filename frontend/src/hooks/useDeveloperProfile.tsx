"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  IUser,
  PortfolioItem,
  ProfileFormData,
  PortfolioFormData as AddPortfolioFormData,
} from "@/types";
import apiClient from "@/lib/apiClient";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useDeveloperProfile = (initialUser: IUser) => {
  // --- STATE MANAGEMENT ---
  const [user, setUser] = useState<IUser>(initialUser);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    item: null as PortfolioItem | null,
  });
  const [isActionInProgress, setIsActionInProgress] = useState(false);

  // --- PROFILE EDIT FORM ---
  const profileForm = useForm<ProfileFormData>();
  const { reset, handleSubmit } = profileForm;

  useEffect(() => {
    if (isEditMode) {
      reset({
        name: user.profile.firstName,
        email: user.email,
        profile: {
          lastName: user.profile.lastName || "",
          bio: user.profile.bio || "",
          skills: (user.profile.skills || []).join(", "),
          experience: user.profile.experience || "",
        },
      });
    }
  }, [isEditMode, user, reset]);

  const handleProfileSubmit = async (data: ProfileFormData) => {
    const toastId = toast.loading("Updating profile...");
    setIsActionInProgress(true);
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
    } catch (err) {
      toast.error("Failed to update profile.", { id: toastId });
    } finally {
      setIsActionInProgress(false);
    }
  };

  // --- PORTFOLIO MANAGEMENT ---
  const portfolioForm = useForm<AddPortfolioFormData>();

  const handleAddPortfolio = async (data: AddPortfolioFormData) => {
    const formData = new FormData();
    // ... build formData

    const toastId = toast.loading("Adding project...");
    setIsActionInProgress(true);
    try {
      const response = await apiClient.post<PortfolioItem[]>(
        "/users/me/portfolio",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setUser((prev) => ({
        ...prev!,
        profile: { ...prev!.profile, portfolio: response.data },
      }));
      toast.success("Project added!", { id: toastId });
      setIsPortfolioModalOpen(false);
      portfolioForm.reset();
    } catch (err) {
      toast.error("Failed to add project.", { id: toastId });
    } finally {
      setIsActionInProgress(false);
    }
  };

  const handleDeletePortfolio = async () => {
    if (!deleteModal.item) return;
    const toastId = toast.loading("Deleting project...");
    setIsActionInProgress(true);
    try {
      await apiClient.delete(`/users/me/portfolio/${deleteModal.item._id}`);
      setUser((prev) => ({
        ...prev!,
        profile: {
          ...prev!.profile,
          portfolio: prev!.profile.portfolio.filter(
            (p) => p._id !== deleteModal.item?._id
          ),
        },
      }));
      toast.success("Project deleted.", { id: toastId });
      setDeleteModal({ isOpen: false, item: null });
    } catch (err) {
      toast.error("Failed to delete project.", { id: toastId });
    } finally {
      setIsActionInProgress(false);
    }
  };

  return {
    user,
    isEditMode,
    setIsEditMode,
    isPortfolioModalOpen,
    setIsPortfolioModalOpen,
    deleteModal,
    setDeleteModal,
    isActionInProgress,
    profileForm,
    portfolioForm,
    handleProfileSubmit: handleSubmit(handleProfileSubmit),
    handleAddPortfolio: portfolioForm.handleSubmit(handleAddPortfolio),
    handleDeletePortfolio,
  };
};
