"use client";

import apiClient from "@/lib/apiClient";
import { IPortfolioItem, IUser } from "@/types";

export const updateMyProfile = async (profileData: any): Promise<IUser> => {
  const { data } = await apiClient.put<IUser>("/users/me", profileData);
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
): Promise<IPortfolioItem[]> => {
  const { data } = await apiClient.post<IPortfolioItem[]>(
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

export const getMyProfile = async (): Promise<IUser> => {
  const { data } = await apiClient.get<IUser>("/users/me");
  return data;
};
