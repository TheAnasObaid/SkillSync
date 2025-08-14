"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getMySubmissions,
  getSubmissionsForReview,
  getPublicSubmissions,
} from "@/services/api/submissions";

export const useMySubmissionsQuery = () => {
  return useQuery({
    queryKey: ["submissions", "my"],
    queryFn: getMySubmissions,
  });
};

export const useSubmissionsForReviewQuery = (challengeId: string) => {
  return useQuery({
    queryKey: ["submissions", "review", challengeId],
    queryFn: () => getSubmissionsForReview(challengeId),
    enabled: !!challengeId,
  });
};

export const usePublicSubmissionsQuery = (
  challengeId: string,
  initialData?: any
) => {
  return useQuery({
    queryKey: ["submissions", "public", challengeId],
    queryFn: () => getPublicSubmissions(challengeId),
    initialData: initialData,
  });
};
