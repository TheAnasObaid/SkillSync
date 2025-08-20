"use client";

import apiClient from "@/lib/apiClient";
import { Prisma, Submission } from "@prisma/client";

// Re-exporting from challenges service to avoid circular dependencies
export { getPublicChallengeById } from "./challenges";
const submissionWithDeveloper =
  Prisma.validator<Prisma.SubmissionDefaultArgs>()({
    include: { developer: true },
  });
export type SubmissionWithDeveloper = Prisma.SubmissionGetPayload<
  typeof submissionWithDeveloper
>;

const mySubmissionWithChallenge =
  Prisma.validator<Prisma.SubmissionDefaultArgs>()({
    include: {
      challenge: {
        select: { id: true, title: true, prize: true, status: true },
      },
    },
  });
export type MySubmissionWithChallenge = Prisma.SubmissionGetPayload<
  typeof mySubmissionWithChallenge
>;

export const submitSolution = async ({
  challengeId,
  formData,
}: {
  challengeId: string;
  formData: FormData;
}): Promise<Submission> => {
  const { data } = await apiClient.post<Submission>(
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
}): Promise<Submission> => {
  const { data } = await apiClient.put<Submission>(
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
}): Promise<Submission> => {
  const { data } = await apiClient.post<Submission>(
    `/submissions/${submissionId}/rate`,
    payload
  );
  return data;
};

export const selectWinner = async (
  submissionId: string
): Promise<Submission> => {
  const { data } = await apiClient.patch<Submission>(
    `/submissions/${submissionId}/winner`
  );
  return data;
};

export const getMySubmissions = async (): Promise<
  MySubmissionWithChallenge[]
> => {
  const { data } = await apiClient.get<MySubmissionWithChallenge[]>(
    "/submissions/me"
  );
  return data;
};

export const getSubmissionsForReview = async (
  challengeId: string
): Promise<SubmissionWithDeveloper[]> => {
  const { data } = await apiClient.get<SubmissionWithDeveloper[]>(
    `/submissions/challenge/${challengeId}/review`
  );
  return data;
};

export const getPublicSubmissions = async (
  challengeId: string
): Promise<Submission[]> => {
  const { data } = await apiClient.get<Submission[]>(
    `/submissions/challenge/${challengeId}`
  );
  return data;
};
