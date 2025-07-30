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

  if (loading)
    return (
      <div className="w-full">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="w-full">
      <div className="grid gap-4">
        {challenges.length > 0 ? (
          challenges.map((challenge) => (
            <div
              key={challenge._id}
              className="card bg-base-200/50 border border-base-300 shadow-md transition-all hover:border-primary/50"
            >
              <div className="card-body p-4 flex-row justify-between items-center">
                <div className="grid gap-2">
                  <p className="font-bold text-xl">{challenge.title}</p>
                  <p className="text-sm text-base-content/50">
                    Prize: ${challenge.prize}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`badge badge-soft ${
                      statusStyles[challenge.status]
                    }`}
                  >
                    {challenge.status}
                  </div>
                  <Link
                    href={`/challenges/${challenge._id}/review`}
                    className="btn btn-secondary"
                  >
                    Review Submissions
                  </Link>
                </div>
              </div>
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
