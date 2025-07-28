"use client";

import apiClient from "@/services/apiClient";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Submission {
  _id: string;
  status: "pending" | "reviewed" | "winner" | "rejected";
  challengeId: {
    _id: string;
    title: string;
    status: string;
    prize: number;
  };
  createdAt: string;
}

const statusStyles: { [key: string]: string } = {
  pending: "badge-info",
  reviewed: "badge-ghost",
  winner: "badge-success",
  rejected: "badge-error",
};

const DeveloperSubmissionList = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await apiClient.get("/submissions/my-submissions");
        setSubmissions(response.data);
      } catch (error) {
        console.error("Failed to fetch developer submissions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  if (loading)
    return (
      <div className="text-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-6">My Submissions</h2>
      <div className="space-y-4">
        {submissions.length > 0 ? (
          submissions.map((sub) => (
            <div key={sub._id} className="card bg-base-200 shadow-md">
              <div className="card-body">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Submission for:</p>
                    <h3 className="card-title text-xl">
                      {sub.challengeId.title}
                    </h3>
                  </div>
                  <div className={`badge ${statusStyles[sub.status]}`}>
                    {sub.status}
                  </div>
                </div>
                <div className="divider my-2"></div>
                <div className="flex justify-between items-center">
                  <p>
                    Submitted on: {new Date(sub.createdAt).toLocaleDateString()}
                  </p>
                  <Link
                    href={`/challenges/${sub.challengeId._id}`}
                    className="btn btn-outline btn-sm"
                  >
                    View Challenge
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>
            You haven't submitted any solutions yet.{" "}
            <Link href="/" className="link">
              Find a challenge
            </Link>{" "}
            to get started!
          </p>
        )}
      </div>
    </div>
  );
};

export default DeveloperSubmissionList;
