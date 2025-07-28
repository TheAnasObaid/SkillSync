"use client";

import UserAvatar from "@/components/Profile/UserAvatar";
import apiClient from "@/services/apiClient";
import { AxiosError } from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiGithub, FiExternalLink, FiAward, FiInfo } from "react-icons/fi";

interface Submission {
  _id: string;
  githubRepo: string;
  liveDemo?: string;
  description: string;
  status: "pending" | "reviewed" | "winner" | "rejected";
  developerId: {
    _id: string;
    profile: {
      firstName: string;
    };
    email: string;
  };
  createdAt: string;
}

const ReviewSubmissionsPage = () => {
  const { id } = useParams() as { id: string };
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [challengeTitle, setChallengeTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  const [isUpdating, setIsUpdating] = useState(false);

  const isChallengeCompleted = submissions.some((s) => s.status === "winner");

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [submissionResponse, challengeResponse] = await Promise.all([
          apiClient.get(`/submissions/challenge/${id}`),
          apiClient.get(`/challenges/${id}`),
        ]);
        setSubmissions(submissionResponse.data);
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

  const handleSelectWinner = async () => {
    if (!selectedSubmission) return;

    setIsUpdating(true);
    setError("");
    try {
      await apiClient.patch(`/submissions/${selectedSubmission._id}/winner`);
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub._id === selectedSubmission._id
            ? { ...sub, status: "winner" }
            : { ...sub, status: "rejected" }
        )
      );
      setIsModalOpen(false);
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

  const openConfirmationModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const statusStyles: { [key: string]: string } = {
    pending: "badge-info badge-outline",
    reviewed: "badge-warning badge-outline",
    winner: "badge-success badge-outline",
    rejected: "badge-error badge-outline",
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <>
      <div className="max-w-6xl mx-auto py-10">
        <div className="grid gap-3 mb-8">
          <h1 className="text-4xl font-bold">{challengeTitle}</h1>
          <p className="text-base-content/70">
            Reviewing all submitted solutions.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {error && (
            <div className="alert alert-error alert-soft my-4">{error}</div>
          )}
          {isChallengeCompleted && (
            <div className="alert alert-success alert-soft my-4">
              <FiAward /> A winner has been selected for this challenge! This
              challenge is now complete.
            </div>
          )}
        </div>

        <div className="card bg-base-200/50 border border-base-300">
          {submissions.length === 0 ? (
            <div className="p-8 text-center text-base-content/70">
              <FiInfo className="mx-auto text-4xl mb-4" />
              No submissions have been made for this challenge yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Developer</th>
                    <th>Status</th>
                    <th>Links</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr
                      key={sub._id}
                      className={`transition-colors ${
                        sub.status === "winner" ? "bg-success/10" : "hover"
                      }`}
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            name={sub.developerId.profile.firstName}
                          />
                          <div>
                            <div className="font-bold">
                              {sub.developerId.profile.firstName}
                            </div>
                            <div className="text-sm opacity-50">
                              {sub.developerId.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${statusStyles[sub.status]}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Link
                            href={sub.githubRepo}
                            target="_blank"
                            className="btn btn-ghost btn-sm"
                          >
                            <FiGithub /> Repo
                          </Link>
                          {sub.liveDemo && (
                            <Link
                              href={sub.liveDemo}
                              target="_blank"
                              className="btn btn-ghost btn-sm"
                            >
                              <FiExternalLink /> Demo
                            </Link>
                          )}
                        </div>
                      </td>
                      <th className="text-right">
                        {!isChallengeCompleted && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => openConfirmationModal(sub)}
                          >
                            <FiAward /> Select Winner
                          </button>
                        )}
                      </th>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <dialog
        id="winner_modal"
        className={`modal ${isModalOpen ? "modal-open" : ""}`}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Winner Selection</h3>
          <p className="py-4">
            Are you sure you want to select the submission by{" "}
            <strong className="text-primary">
              {selectedSubmission?.developerId.profile.firstName}
            </strong>{" "}
            as the winner? This action will complete the challenge and cannot be
            undone.
          </p>
          <div className="modal-action">
            <button
              className="btn btn-ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSelectWinner}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Confirm & Select Winner"
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsModalOpen(false)}>close</button>
        </form>
      </dialog>
    </>
  );
};

export default ReviewSubmissionsPage;
