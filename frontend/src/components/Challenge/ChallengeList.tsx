"use client";

import { useEffect, useState } from "react";
import apiClient from "@/services/apiClient";
import ChallengeCard, { Challenge } from "./ChallengeCard";

const ChallengeList = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setError("");
        setLoading(true);
        const response = await apiClient.get("/challenges");
        setChallenges(response.data);
      } catch (err) {
        setError("Failed to load challenges. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-error p-10">{error}</p>;
  }

  return (
    <div className="grid gap-8">
      {challenges.length > 0 ? (
        challenges.map((challenge) => (
          <ChallengeCard key={challenge._id} challenge={challenge} />
        ))
      ) : (
        <p className="text-center text-gray-500 p-10">
          No challenges available at the moment. Check back soon!
        </p>
      )}
    </div>
  );
};

export default ChallengeList;
