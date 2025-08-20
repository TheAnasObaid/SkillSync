"use client";

import {
  getMySubmissions,
  getPublicSubmissions,
  getSubmissionsForReview,
  MySubmissionWithChallenge,
  SubmissionWithDeveloper,
} from "@/services/api/submissions";
import { Submission } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export const useMySubmissionsQuery = () => {
  return useQuery<MySubmissionWithChallenge[]>({
    queryKey: ["submissions", "my"],
    queryFn: getMySubmissions,
  });
};

// This hook is now specific and strongly typed.
export const useSubmissionsForReviewQuery = (challengeId: string) => {
  return useQuery<SubmissionWithDeveloper[]>({
    queryKey: ["submissions", "review", challengeId],
    queryFn: () => getSubmissionsForReview(challengeId),
    enabled: !!challengeId,
  });
};

export const usePublicSubmissionsQuery = (
  challengeId: string,
  initialData?: any
) => {
  return useQuery<Submission[]>({
    queryKey: ["submissions", "public", challengeId],
    queryFn: () => getPublicSubmissions(challengeId),
    initialData: initialData,
  });
};
