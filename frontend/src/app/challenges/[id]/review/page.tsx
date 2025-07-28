"use client";

import apiClient from "@/services/apiClient";
import { AxiosError } from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Submission {
  _id: string;
  githubRepo: string;
  liveDemo?: string;
  description: string;
  status: string;
  developerId: {
    _id: string;
    profile: {
      firstName: string;
    };
    email: string;
  };
}

const ReviewSubmissionsPage = () => {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [challengeTitle, setChallengeTitle] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSelectWinner = async (submissionId: string) => {
    if (
      !confirm(
        "Are you sure you want to select this submission as the winner? This cannot be undone."
      )
    ) {
      return;
    }

    setIsUpdating(true);
    setError("");
    try {
      await apiClient.patch(`/submissions/${submissionId}/winner`);

      setSubmissions((prev) =>
        prev.map((sub) =>
          sub._id === submissionId
            ? { ...sub, status: "winner" }
            : { ...sub, status: "rejected" }
        )
      );
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data.message || "Failed to select winner.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const submissionResponse = await apiClient.get(
          `/submissions/challenge/${id}`
        );
        setSubmissions(submissionResponse.data);

        const challengeResponse = await apiClient.get(`/challenges/${id}`);
        setChallengeTitle(challengeResponse.data.title);
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(err.response?.data.message || "Failed to load submissions.");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [id]);

  if (loading)
    return (
      <div className="text-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  if (error) return <p className="text-center text-error p-10">{error}</p>;

  console.log("Submissions", submissions);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Reviewing Submissions for:</h1>
      <h2 className="text-2xl text-secondary mb-8">{challengeTitle}</h2>

      {submissions.length === 0 ? (
        <p>No submissions have been made for this challenge yet.</p>
      ) : (
        <div className="space-y-6">
          {submissions.map((sub) => (
            <div key={sub._id} className="card bg-base-100 shadow-lg border">
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <h3 className="card-title">
                    Submission by: {sub.developerId.profile.firstName} (
                    {sub.developerId.email})
                  </h3>
                  <div
                    className={`badge ${
                      sub.status === "winner" ? "badge-success" : "badge-ghost"
                    }`}
                  >
                    {sub.status}
                  </div>
                </div>
                <p className="mt-4">{sub.description}</p>
                <div className="card-actions justify-start mt-4 gap-4">
                  <Link
                    href={sub.githubRepo}
                    target="_blank"
                    className="btn btn-outline"
                  >
                    GitHub Repo
                  </Link>
                  {sub.liveDemo && (
                    <Link
                      href={sub.liveDemo}
                      target="_blank"
                      className="btn btn-outline btn-accent"
                    >
                      Live Demo
                    </Link>
                  )}
                </div>
                <div className="divider"></div>
                <div className="card-actions justify-end">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleSelectWinner(sub._id)}
                    disabled={
                      isUpdating ||
                      submissions.some((s) => s.status === "winner")
                    }
                  >
                    {isUpdating ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      "Select as Winner"
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSubmissionsPage;
