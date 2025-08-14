"use client";

import {
  getMySubmissions,
  getSubmissionsForReview,
} from "@/services/api/submissions";
import { useQuery } from "@tanstack/react-query";

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
