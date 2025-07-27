"use client";

import apiClient from "@/services/apiClient";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface Challenge {
  _id: string;
  title: string;
  prize: number;
  status: "draft" | "published" | "active" | "judging" | "completed";
}

const statusStyles = {
  draft: "badge-ghost",
  published: "badge-info",
  active: "badge-info",
  judging: "badge-warning",
  completed: "badge-success",
};

const ClientChallengeList = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientChallenges = async () => {
      try {
        const response = await apiClient.get("/challenges/my-challenges");
        setChallenges(response.data);
      } catch (error) {
        console.error("Failed to fetch client challenges", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClientChallenges();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-6">My Posted Challenges</h2>
      <div className="space-y-4">
        {challenges.length > 0 ? (
          challenges.map((challenge) => (
            <div
              key={challenge._id}
              className="grid grid-cols-[1fr_auto_auto] gap-4 items-center p-4 bg-base-200 rounded-lg"
            >
              <div>
                <p className="font-bold text-lg">{challenge.title}</p>
                <p className="text-sm text-gray-500">
                  Prize: ${challenge.prize}
                </p>
              </div>
              <div className={`badge ${statusStyles[challenge.status]}`}>
                {challenge.status}
              </div>
              <Link
                href={`/client/challenges/${challenge._id}/review`}
                className="btn btn-secondary"
              >
                Review Submissions
              </Link>
            </div>
          ))
        ) : (
          <p>
            You haven't posted any challenges yet. Go to the "Create Challenge"
            tab to get started!
          </p>
        )}
      </div>
    </div>
  );
};

export default ClientChallengeList;
