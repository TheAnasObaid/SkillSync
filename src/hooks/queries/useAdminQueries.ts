"use client";

import {
  getAllSubmissions,
  getAllUsers,
  AdminSubmission,
} from "@/services/api/admin";
import { useQuery } from "@tanstack/react-query";

export const useAllUsersQuery = () => {
  return useQuery({
    queryKey: ["users", "all"],
    queryFn: getAllUsers,
  });
};

export const useAllSubmissionsQuery = () => {
  return useQuery<AdminSubmission[]>({
    queryKey: ["submissions", "all"],
    queryFn: getAllSubmissions,
  });
};
