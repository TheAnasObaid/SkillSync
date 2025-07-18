"use client";

import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import SubmissionForm from "@/components/Submission/SubmissionForm";
import apiClient from "@/services/apiClient";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Challenge {
  _id: string;
  title: string;
  description: string;
  prize: number;
  status: "open" | "closed";
}

export default function SingleChallengePage() {
  const { id } = useParams();

  const [challenge, setChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const { data } = await apiClient.get(`/challenges/${id}`);
        setChallenge(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChallenge();
  }, [id]);

  if (!challenge) return <p>Loading challenge...</p>;

  return (
    <ProtectedRoute requiredRole="developer">
      <div className="grid grid-cols-2">
        <div className="p-4 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold">{challenge.title}</h2>
          <p>{challenge.description}</p>
          <p className="font-semibold">Prize: ${challenge.prize}</p>
        </div>
        <div>
          <SubmissionForm id={challenge._id} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
