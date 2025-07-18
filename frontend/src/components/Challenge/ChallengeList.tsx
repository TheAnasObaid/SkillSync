"use client";

import { Challenge } from "@/app/client/dashboard/page";
import apiClient from "@/services/apiClient";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const ChallengeList = () => {
  const [error, setError] = useState("");
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const { data } = await apiClient.get("/challenges");
        setChallenges(data);
      } catch (error) {
        if (error instanceof AxiosError) setError(error.response?.data.message);
      }
    };

    fetchChallenges();
  }, []);

  if (error) return <p className="text-error">{error}</p>;

  if (challenges.length < 1) return <p>No challenge found.</p>;

  return (
    <ul className="list bg-base-100 rounded-box shadow-md">
      {challenges.map((challenge) => (
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          {challenge.title}
        </li>
      ))}
    </ul>
  );
};

export default ChallengeList;
