"use client";

import { getMyChallenges } from "@/services/api/challenges";
import { useQuery } from "@tanstack/react-query";

export const useMyChallengesQuery = () => {
  return useQuery({
    queryKey: ["challenges", "my"],
    queryFn: getMyChallenges,
  });
};
