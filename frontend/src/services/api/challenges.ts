"use client";

import apiClient from "@/lib/apiClient";
import { IChallenge } from "@/types";

export const createChallenge = async (
  formData: FormData
): Promise<IChallenge> => {
  const { data } = await apiClient.post<IChallenge>("/challenges", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const getMyChallenges = async (): Promise<IChallenge[]> => {
  const { data } = await apiClient.get<IChallenge[]>("/challenges/me");
  return data;
};

export const updateChallenge = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}): Promise<IChallenge> => {
  const { data } = await apiClient.put<IChallenge>(
    `/challenges/${id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data;
};

export const deleteChallenge = async (
  id: string
): Promise<{ message: string }> => {
  const { data } = await apiClient.delete(`/challenges/${id}`);
  return data;
};

export const fundChallenge = async (
  id: string
): Promise<{ challenge: IChallenge }> => {
  const { data } = await apiClient.patch(`/challenges/${id}/fund`);
  return data;
};

export const getPublicChallengeById = async (
  id: string
): Promise<IChallenge> => {
  const { data } = await apiClient.get<IChallenge>(`/challenges/${id}`);
  return data;
};
