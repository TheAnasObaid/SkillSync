"use client";

import apiClient from "@/lib/apiClient";
import { PortfolioItem, User } from "@prisma/client";

export const getMyProfile = async (): Promise<
  User & { portfolio: PortfolioItem[] }
> => {
  const { data } = await apiClient.get<User & { portfolio: PortfolioItem[] }>(
    "/users/me"
  );
  return data;
};

export const updateMyProfile = async (
  profileData: Partial<User>
): Promise<User> => {
  const { data } = await apiClient.put<User>("/users/me", profileData);
  return data;
};

export const uploadMyAvatar = async (
  formData: FormData
): Promise<{ avatarUrl: string }> => {
  const { data } = await apiClient.post<{ avatarUrl: string }>(
    "/users/me/avatar",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data;
};

export const addPortfolioItem = async (
  formData: FormData
): Promise<PortfolioItem> => {
  const { data } = await apiClient.post<PortfolioItem>(
    "/users/me/portfolio",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data;
};

export const deletePortfolioItem = async (
  itemId: string
): Promise<{ message: string }> => {
  const { data } = await apiClient.delete(`/users/me/portfolio/${itemId}`);
  return data;
};
