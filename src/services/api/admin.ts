"use client";

import apiClient from "@/lib/apiClient";
import { ISubmission, IUser } from "@/types";

export const updateUserAsAdmin = async ({
  userId,
  updates,
}: {
  userId: string;
  updates: any;
}): Promise<IUser> => {
  const { data } = await apiClient.patch<IUser>(
    `/admin/users/${userId}`,
    updates
  );
  return data;
};

export const getAllUsers = async (): Promise<IUser[]> => {
  const { data } = await apiClient.get<IUser[]>("/admin/users");
  return data;
};

export const getAllSubmissions = async (): Promise<ISubmission[]> => {
  const { data } = await apiClient.get<ISubmission[]>("/admin/submissions");
  return data;
};
