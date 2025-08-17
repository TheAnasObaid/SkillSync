"use client";

import apiClient from "@/lib/apiClient";
import { Challenge } from "@prisma/client";

export const createChallenge = async (
  formData: FormData
): Promise<Challenge> => {
  const { data } = await apiClient.post<Challenge>("/challenges", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const getMyChallengesAsClient = async (): Promise<Challenge[]> => {
  const { data } = await apiClient.get<Challenge[]>("/challenges/me");
  return data;
};

export const updateChallenge = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}): Promise<Challenge> => {
  const { data } = await apiClient.put<Challenge>(
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
): Promise<{ challenge: Challenge }> => {
  const { data } = await apiClient.patch(`/challenges/${id}/fund`);
  return data;
};

export const getPublicChallengeById = async (
  id: string
): Promise<Challenge> => {
  const { data } = await apiClient.get<Challenge>(`/challenges/${id}`);
  return data;
};
