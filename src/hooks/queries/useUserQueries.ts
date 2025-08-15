"use client";

import { getMyProfile } from "@/services/api/users";
import { useQuery } from "@tanstack/react-query";

export const useMyProfileQuery = () => {
  return useQuery({
    queryKey: ["users", "me"],
    queryFn: getMyProfile,
  });
};
