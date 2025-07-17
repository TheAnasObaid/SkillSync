"use client";

import { useAuthStore } from "@/store/authStore";
import apiClient from "@/utils/api-client";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Challenge } from "../client/profile/page";

const Challenges = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const { setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(false);
  }, []);

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

  return (
    <div>
      <ul className="flex flex-col gap-3">
        {challenges.map((challenge) => (
          <li key={challenge._id}>
            <div className="card bg-neutral-50">
              <div className="card-body">
                <h2 className="card-title text-xl">{challenge.title}</h2>
                <h3 className="font-bold text-lg">${challenge.prize}</h3>
                <p className="flex gap-1">
                  Published at
                  <span className="font-semibold">
                    {new Date(challenge.createdAt).toLocaleDateString()}
                  </span>
                </p>
                <p>{challenge.description}</p>
                <div className="card-actions justify-end">
                  <button
                    className="btn btn-secondary"
                    onClick={() => router.push(`/challenges/${challenge._id}`)}
                  >
                    View Challenge
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Challenges;
