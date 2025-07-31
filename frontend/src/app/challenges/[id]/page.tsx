"use client";

import apiClient from "@/lib/apiClient";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Challenge } from "@/components/Challenge/ChallengeCard";
import SubmissionForm from "@/components/Submission/SubmissionForm";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FiAward,
  FiClock,
  FiHash,
  FiGitBranch,
  FiLogIn,
  FiCheckCircle,
  FiDownload,
} from "react-icons/fi";
import PublicSubmissionList from "@/components/Submission/PublicSubmissionList";

const CtaBlock = ({
  role,
  onOpenModal,
}: {
  role: string | null;
  onOpenModal: () => void;
}) => {
  if (role === "developer") {
    return (
      <button className="btn btn-primary btn-block" onClick={onOpenModal}>
        <FiGitBranch /> Submit Solution
      </button>
    );
  }

  if (role === "client") {
    return (
      <div className="alert alert-info text-center">
        <p>You are viewing this challenge as a client.</p>
      </div>
    );
  }

  return (
    <div className="alert alert-warning text-center">
      <Link
        href="/login"
        className="flex items-center justify-center gap-2 w-full"
      >
        <FiLogIn />
        <span>Log in as a Developer to Submit</span>
      </Link>
    </div>
  );
};

const ChallengeDetailsPage = () => {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "submissions">(
    "description"
  );
  const [submissionCount, setSubmissionCount] = useState(0);

  const { id } = useParams() as { id: string };
  const { user } = useAuthStore();

  useEffect(() => {
    if (!id) return;

    const fetchChallenge = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/challenges/${id}`);
        setChallenge(response.data);
      } catch (err) {
        setError("Challenge not found or failed to load.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setSubmissionSuccess(false), 300);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  if (error || !challenge) {
    return (
      <div className="alert alert-error max-w-xl mx-auto my-10">
        <p>{error}</p>
      </div>
    );
  }

  const formattedDeadline = new Date(challenge.deadline).toLocaleDateString();
  const difficultyStyles = {
    beginner: "badge-success",
    intermediate: "badge-warning",
    advanced: "badge-error",
  };

  return (
    <>
      <div className="max-w-6xl w-full mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold">
              {challenge.title}
            </h1>

            <div role="tablist" className="tabs tabs-bordered">
              <a
                role="tab"
                className={`tab ${
                  activeTab === "description" ? "tab-active" : ""
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </a>
              <a
                role="tab"
                className={`tab ${
                  activeTab === "submissions" ? "tab-active" : ""
                }`}
                onClick={() => setActiveTab("submissions")}
              >
                Submissions ({submissionCount})
              </a>
            </div>

            {activeTab === "description" && (
              <div className="prose max-w-none text-base-content/80">
                <h2 className="text-2xl font-semibold text-base-content">
                  Description
                </h2>
                <p>{challenge.description}</p>
                <h2 className="text-2xl font-semibold text-base-content mt-8">
                  Requirements
                </h2>
                <p>{challenge.requirements}</p>
              </div>
            )}
            {activeTab === "submissions" && (
              <PublicSubmissionList
                challengeId={challenge._id}
                onCountChange={setSubmissionCount}
              />
            )}
          </div>
          <aside className="space-y-6 lg:sticky top-24 h-fit">
            <div className="card bg-base-200/50 border border-base-300">
              <div className="card-body">
                <div className="flex items-start gap-4">
                  <FiAward className="text-primary text-2xl mt-1" />
                  <div>
                    <h3 className="font-semibold text-base-content/70">
                      Prize
                    </h3>
                    <p className="text-3xl font-bold text-primary">
                      ${challenge.prize.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="divider my-2" />
                <div className="flex items-center gap-4">
                  <FiClock className="text-base-content/70 text-xl" />
                  <div>
                    <h3 className="font-semibold text-base-content/70">
                      Deadline
                    </h3>
                    <p className="font-semibold">{formattedDeadline}</p>
                  </div>
                </div>
                <div className="divider my-2" />
                <div className="flex items-start gap-4">
                  <FiHash className="text-base-content/70 text-xl mt-1" />
                  <div>
                    <h3 className="font-semibold text-base-content/70 mb-2">
                      Info
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <div
                        className={`badge badge-outline ${
                          difficultyStyles[challenge.difficulty]
                        }`}
                      >
                        {challenge.difficulty}
                      </div>
                      {challenge.tags.map((tag) => (
                        <div
                          key={tag}
                          className="badge badge-neutral badge-outline font-mono text-xs"
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {challenge.files && challenge.files.length > 0 && (
              <div className="card bg-base-200/50 border border-base-300">
                <div className="card-body">
                  <h3 className="card-title">Attached Resources</h3>
                  <div className="space-y-2 mt-2">
                    {challenge.files.map((file, index) => (
                      <a
                        key={index}
                        href={`${
                          process.env.NEXT_PUBLIC_API_BASE_URL
                        }/${file.path.replace(/\\/g, "/")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-block"
                        download={file.name}
                      >
                        <FiDownload className="mr-2" /> {file.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {user && (
              <CtaBlock
                role={user.role}
                onOpenModal={() => setIsModalOpen(true)}
              />
            )}
          </aside>
        </div>
      </div>

      <dialog
        id="submission_modal"
        className={`modal ${isModalOpen ? "modal-open" : ""}`}
      >
        <div className="modal-box relative border border-base-300">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleModalClose}
          >
            ✕
          </button>

          {submissionSuccess ? (
            <div className="text-center p-8 space-y-4">
              <FiCheckCircle className="text-success text-6xl mx-auto" />
              <h3 className="font-bold text-2xl">Submission Successful!</h3>
              <p className="text-base-content/70">
                Your solution has been submitted for review. Good luck!
              </p>
              <div className="modal-action justify-center mt-4">
                <button className="btn btn-primary" onClick={handleModalClose}>
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="font-bold text-lg mb-6">Submit Your Solution</h3>
              <SubmissionForm
                challengeId={challenge._id}
                onSuccess={() => setSubmissionSuccess(true)}
              />
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleModalClose}>close</button>
        </form>
      </dialog>
    </>
  );
};

export default ChallengeDetailsPage;
