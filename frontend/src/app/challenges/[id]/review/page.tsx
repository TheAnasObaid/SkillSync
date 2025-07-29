"use client";

import StarRating from "@/components/Common/StarRating";
import UserAvatar from "@/components/Profile/UserAvatar";
import apiClient from "@/services/apiClient";
import { AxiosError } from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiAward,
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
  FiGithub,
  FiInfo,
  FiMessageSquare,
  FiStar,
} from "react-icons/fi";

// Updated interface to include all necessary fields from the spec
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
      avatar: string;
    };
    email: string;
  };
  ratings?: {
    overall: number;
  };
  feedback?: string;
  createdAt: string;
}

interface RatingFormData {
  rating: number;
  feedback: string;
}

const ReviewSubmissionsPage = () => {
  const { id: challengeId } = useParams() as { id: string };

  // State Management
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [challengeTitle, setChallengeTitle] = useState("");

  // State for new features
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // State for filtering and sorting
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  const { register, handleSubmit, setValue, reset, watch } =
    useForm<RatingFormData>({
      defaultValues: { rating: 0, feedback: "" },
    });
  const ratingValue = watch("rating");

  // Fetch initial data
  useEffect(() => {
    if (!challengeId) return;
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const [subResponse, chalResponse] = await Promise.all([
          apiClient.get(`/submissions/challenge/${challengeId}`),
          apiClient.get(`/challenges/${challengeId}`),
        ]);
        setSubmissions(subResponse.data);
        setChallengeTitle(chalResponse.data.title);
      } catch (err) {
        setError(
          err instanceof AxiosError
            ? err.response?.data.message
            : "Failed to load data."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [challengeId]);

  // Derived state for filtered and sorted submissions
  const filteredAndSortedSubmissions = useMemo(() => {
    return submissions
      .filter((sub) => statusFilter === "all" || sub.status === statusFilter)
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [submissions, statusFilter, sortOrder]);

  const isChallengeCompleted = submissions.some((s) => s.status === "winner");

  // Handlers for Modals and API calls
  const handleSelectWinner = async () => {
    if (!selectedSubmission) return;
    setIsUpdating(true);
    try {
      await apiClient.patch(`/submissions/${selectedSubmission._id}/winner`);
      setSubmissions((prev) =>
        prev.map((sub) => ({
          ...sub,
          status: sub._id === selectedSubmission._id ? "winner" : "rejected",
        }))
      );
      setIsWinnerModalOpen(false);
    } catch (err) {
      setError(
        err instanceof AxiosError
          ? err.response?.data.message
          : "Failed to select winner."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRateSubmission = async (data: RatingFormData) => {
    if (!selectedSubmission) return;
    setIsUpdating(true);
    try {
      // Assumes a backend endpoint: POST /api/submissions/:id/rate
      // This endpoint should save the rating and feedback.
      await apiClient.post(`/submissions/${selectedSubmission._id}/rate`, {
        ratings: { overall: data.rating },
        feedback: data.feedback,
      });
      // Update local state to reflect the new rating
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub._id === selectedSubmission._id
            ? {
                ...sub,
                ratings: { overall: data.rating },
                feedback: data.feedback,
                status: "reviewed",
              }
            : sub
        )
      );
      setIsRatingModalOpen(false);
    } catch (err) {
      setError(
        err instanceof AxiosError
          ? err.response?.data.message
          : "Failed to save review."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Functions to open modals with correct context
  const openWinnerModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsWinnerModalOpen(true);
  };

  const openRatingModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    reset({
      rating: submission.ratings?.overall || 0,
      feedback: submission.feedback || "",
    });
    setIsRatingModalOpen(true);
  };

  const statusStyles: { [key: string]: string } = {
    pending: "badge-info",
    reviewed: "badge-warning",
    winner: "badge-success",
    rejected: "badge-error",
  };

  if (loading)
    return (
      <div className="text-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <>
      <div className="max-w-6xl w-full mx-auto py-10 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">{challengeTitle}</h1>
          <p className="text-base-content/70 mt-1">
            Review all submitted solutions.
          </p>
        </div>

        {error && <div className="alert alert-error my-4">{error}</div>}
        {isChallengeCompleted && (
          <div className="alert alert-success alert-soft my-4">
            <FiAward /> A winner has been selected! This challenge is now
            complete.
          </div>
        )}

        {/* Filter and Sort Controls */}
        <div className="flex justify-between items-center bg-base-200 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="label">Filter by status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="select select-bordered select-sm"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="winner">Winner</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="label">Sort by date</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="select select-bordered select-sm"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submissions Table Card */}
        <div className="card bg-base-200/50 border border-base-300 shadow-md transition-all hover:border-primary/50">
          {filteredAndSortedSubmissions.length === 0 ? (
            <div className="p-8 text-center text-base-content/70">
              <FiInfo className="mx-auto text-4xl mb-4" />
              No submissions match your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Developer</th>
                    <th>Status</th>
                    <th>Rating</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedSubmissions.map((sub) => (
                    <Fragment key={sub._id}>
                      <tr
                        className={`transition-colors hover:bg-base-300/40 cursor-pointer ${
                          sub.status === "winner" ? "bg-success/10" : ""
                        }`}
                        onClick={() =>
                          setExpandedId(expandedId === sub._id ? null : sub._id)
                        }
                      >
                        <th>
                          {expandedId === sub._id ? (
                            <FiChevronUp />
                          ) : (
                            <FiChevronDown />
                          )}
                        </th>
                        <td>
                          <div className="flex items-center gap-3">
                            <UserAvatar
                              name={sub.developerId.profile.firstName}
                              avatarUrl={sub.developerId.profile.avatar}
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
                          <span
                            className={`badge badge-outline ${
                              statusStyles[sub.status]
                            }`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td>
                          {sub.ratings?.overall ? (
                            <div className="flex items-center gap-1 text-warning">
                              {[...Array(sub.ratings.overall)].map((_, i) => (
                                <FiStar key={i} fill="currentColor" />
                              ))}
                            </div>
                          ) : (
                            <span className="text-base-content/50">
                              Not Rated
                            </span>
                          )}
                        </td>
                        <td className="text-right space-x-2">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              openRatingModal(sub);
                            }}
                          >
                            <FiStar /> Rate & Review
                          </button>
                          {!isChallengeCompleted && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                openWinnerModal(sub);
                              }}
                            >
                              <FiAward /> Select Winner
                            </button>
                          )}
                        </td>
                      </tr>

                      {expandedId === sub._id && (
                        <tr
                          className={
                            sub.status === "winner" ? "bg-success/5" : ""
                          }
                        >
                          <td colSpan={5} className="p-0">
                            <div className="p-6 bg-base-100/50 space-y-4">
                              <h4 className="font-bold">Submission Details:</h4>
                              <p className="whitespace-pre-wrap">
                                {sub.description || "No description provided."}
                              </p>
                              <div className="flex items-center gap-4 pt-2">
                                <Link
                                  href={sub.githubRepo}
                                  target="_blank"
                                  className="btn btn-ghost btn-sm"
                                >
                                  <FiGithub /> GitHub Repo
                                </Link>
                                {sub.liveDemo && (
                                  <Link
                                    href={sub.liveDemo}
                                    target="_blank"
                                    className="btn btn-ghost btn-sm"
                                  >
                                    <FiExternalLink /> Live Demo
                                  </Link>
                                )}
                              </div>
                              {sub.feedback && (
                                <div className="pt-2">
                                  <h5 className="font-bold flex items-center gap-2">
                                    <FiMessageSquare /> Client Feedback:
                                  </h5>
                                  <p className="text-base-content/80 mt-1 pl-2 border-l-2 border-base-300">
                                    {sub.feedback}
                                  </p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Winner Confirmation Modal */}
      <dialog className={`modal ${isWinnerModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Winner Selection</h3>
          <p className="py-4">
            Are you sure you want to select the submission by{" "}
            <strong className="text-primary">
              {selectedSubmission?.developerId.profile.firstName}
            </strong>{" "}
            as the winner? This action cannot be undone.
          </p>
          <div className="modal-action">
            <button
              className="btn btn-ghost"
              onClick={() => setIsWinnerModalOpen(false)}
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
                "Confirm & Select"
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsWinnerModalOpen(false)}>close</button>
        </form>
      </dialog>

      {/* Rating & Feedback Modal */}
      <dialog className={`modal ${isRatingModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setIsRatingModalOpen(false)}
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">
            Review Submission from{" "}
            <span className="text-primary">
              {selectedSubmission?.developerId.profile.firstName}
            </span>
          </h3>
          <form
            onSubmit={handleSubmit(handleRateSubmission)}
            className="space-y-4 mt-4"
          >
            <div>
              <label className="label">
                <span className="label-text">Overall Rating</span>
              </label>
              <StarRating
                value={ratingValue}
                onChange={(rating: number) =>
                  setValue("rating", rating, { shouldValidate: true })
                }
              />
              <input
                type="hidden"
                {...register("rating", { required: true, min: 1 })}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Feedback</span>
              </label>
              <textarea
                {...register("feedback")}
                className="textarea textarea-bordered w-full"
                rows={4}
                placeholder="Provide constructive feedback..."
              ></textarea>
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setIsRatingModalOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Save Review"
                )}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsRatingModalOpen(false)}>close</button>
        </form>
      </dialog>
    </>
  );
};

export default ReviewSubmissionsPage;
