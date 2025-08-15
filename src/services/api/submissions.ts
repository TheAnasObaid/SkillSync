"use client";

import apiClient from "@/lib/apiClient";
import { IChallenge, ISubmission } from "@/types";

export const submitSolution = async ({
  challengeId,
  formData,
}: {
  challengeId: string;
  formData: FormData;
}): Promise<ISubmission> => {
  const { data } = await apiClient.post<ISubmission>(
    `/submissions/challenge/${challengeId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data;
};

export const updateSubmission = async ({
  submissionId,
  formData,
}: {
  submissionId: string;
  formData: any;
}): Promise<ISubmission> => {
  const { data } = await apiClient.put<ISubmission>(
    `/submissions/${submissionId}`,
    formData
  );
  return data;
};

export const withdrawSubmission = async (
  submissionId: string
): Promise<{ message: string }> => {
  const { data } = await apiClient.delete(`/submissions/${submissionId}`);
  return data;
};

interface RateSubmissionPayload {
  rating: number;
  feedback: string;
}
export const rateSubmission = async ({
  submissionId,
  payload,
}: {
  submissionId: string;
  payload: RateSubmissionPayload;
}): Promise<ISubmission> => {
  const { data } = await apiClient.post<ISubmission>(
    `/submissions/${submissionId}/rate`,
    payload
  );
  return data;
};

export const selectWinner = async (
  submissionId: string
): Promise<ISubmission> => {
  const { data } = await apiClient.patch<ISubmission>(
    `/submissions/${submissionId}/winner`
  );
  return data;
};

export const getMySubmissions = async (): Promise<ISubmission[]> => {
  const { data } = await apiClient.get<ISubmission[]>("/submissions/me");
  return data;
};

export const getSubmissionsForReview = async (
  challengeId: string
): Promise<ISubmission[]> => {
  const { data } = await apiClient.get<ISubmission[]>(
    `/submissions/challenge/${challengeId}/review`
  );
  return data;
};

export const getPublicChallengeById = async (
  id: string
): Promise<IChallenge> => {
  const { data } = await apiClient.get<IChallenge>(`/challenges/${id}`);
  return data;
};

export const getPublicSubmissions = async (
  challengeId: string
): Promise<ISubmission[]> => {
  const { data } = await apiClient.get<ISubmission[]>(
    `/submissions/challenge/${challengeId}`
  );
  return data;
};
