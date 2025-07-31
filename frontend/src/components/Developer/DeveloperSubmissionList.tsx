"use client";

import apiClient from "@/lib/apiClient";
import Link from "next/link";
import { useEffect, useState } from "react";
// Import the icons we'll use for a richer UI
import { FiAward, FiClock, FiExternalLink } from "react-icons/fi";
import NoItemFound from "./NoItem";

// The interface is correct, no changes needed
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

const DeveloperSubmissionList = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await apiClient.get("/submissions/me");
        setSubmissions(response.data);
      } catch (error) {
        console.error("Failed to fetch developer submissions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const statusStyles: { [key: string]: string } = {
    pending: "badge-info",
    reviewed: "badge-ghost",
    winner: "badge-success",
    rejected: "badge-error",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {submissions.length > 0 ? (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <div
              key={sub._id}
              className="card bg-base-200/50 border border-base-300 shadow-md transition-all hover:border-primary/50"
            >
              <div className="card-body p-6">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="card-title text-xl font-bold">
                    {sub.challengeId.title}
                  </h3>
                  <div
                    className={`badge badge-soft ${statusStyles[sub.status]}`}
                  >
                    {sub.status}
                  </div>
                </div>

                <div className="flex justify-between items-end mt-4">
                  <div className="space-y-2">
                    {/* Prize Info */}
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <FiAward />
                      <span>
                        ${sub.challengeId.prize.toLocaleString()} Prize
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-base-content/70">
                      <FiClock />
                      <span>
                        Submitted on:{" "}
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/challenges/${sub.challengeId._id}`}
                    className="btn btn-outline btn-sm"
                  >
                    View Original Challenge <FiExternalLink />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NoItemFound />
      )}
    </div>
  );
};

export default DeveloperSubmissionList;
