"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { IChallenge, ISubmission } from "@/types";
import { FiCheckCircle, FiClock, FiUsers } from "react-icons/fi";
import SubmissionForm from "@/components/Submission/SubmissionForm";
import PublicSubmissionList from "@/components/Submission/PublicSubmissionList";
import UserAvatar from "../Profile/UserAvatar";
import ChallengeSidebar from "./ChallengeSidebar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// The full type for submissions with our temporary 'isNew' flag
type LiveSubmission = ISubmission & { isNew?: boolean };

interface Props {
  initialChallenge: IChallenge | null;
  initialSubmissions?: LiveSubmission[];
}

const difficultyStyles = {
  beginner: "badge-success",
  intermediate: "badge-warning",
  advanced: "badge-error",
};

const ChallengeDetailsClient = ({
  initialChallenge,
  initialSubmissions = [],
}: Props) => {
  // --- STATE MANAGEMENT ---
  const [challenge] = useState(initialChallenge); // Initial data from server
  const [submissions, setSubmissions] =
    useState<LiveSubmission[]>(initialSubmissions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "submissions">(
    "description"
  );

  const { user } = useAuthStore();

  // Example real-time update logic (requires a Socket.io context)
  // const socket = useSocket();
  // useEffect(() => {
  //   if (!socket || !challenge) return;
  //   socket.on("new_submission", (newSub: ISubmission) => {
  //     const submissionWithFlag = { ...newSub, isNew: true };
  //     setSubmissions(prev => [submissionWithFlag, ...prev]);
  //     setTimeout(() => {
  //       setSubmissions(current => current.map(s => s._id === newSub._id ? { ...s, isNew: false } : s));
  //     }, 3000);
  //   });
  //   return () => { socket.off("new_submission"); };
  // }, [socket, challenge]);

  // --- DERIVED STATE & HANDLERS ---
  if (!challenge) {
    return <div className="alert alert-error">Challenge data is missing.</div>;
  }

  const { createdBy: client } = challenge;
  const formattedDeadline = new Date(challenge.deadline).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
  const submissionCount = submissions.length;

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setSubmissionSuccess(false), 300);
  };

  const handleSuccessfulSubmission = () => {
    setSubmissionSuccess(true);
    // You might want to refresh the submissions list from the API here
  };

  return (
    <>
      {/* --- 1. UPGRADED HERO SECTION --- */}
      <div className="card bg-base-200/50 border border-base-300">
        <div className="max-w-6xl w-full mx-auto px-4 py-8">
          {typeof client === "object" && client?.profile && (
            <div className="flex items-center gap-3 mb-4">
              <UserAvatar
                name={client.profile.firstName}
                avatarUrl={client.profile.avatar}
                className="w-10 h-10"
              />
              <div>
                <p className="text-sm text-base-content/70">Posted by</p>
                <p className="font-semibold">
                  {client.profile.companyName || client.profile.firstName}
                </p>
              </div>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold">{challenge.title}</h1>
          <div className="divider" />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-base-content/80 border-base-300">
            <div className="flex items-center gap-2 font-semibold">
              <FiClock />
              <span>Deadline: {formattedDeadline}</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <FiUsers />
              <span>
                {submissionCount}{" "}
                {submissionCount === 1 ? "Participant" : "Participants"}
              </span>
            </div>
            <div
              className={`badge badge-lg ${
                difficultyStyles[challenge.difficulty]
              }`}
            >
              {challenge.difficulty}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-[1fr_350px] gap-12">
          <div className="space-y-6">
            <div role="tablist" className="tabs tabs-bordered">
              <a
                role="tab"
                className={`tab rounded-md transition-all duration-300 ${
                  activeTab === "description"
                    ? "tab-active"
                    : "hover:bg-base-content/5"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Requirements
              </a>
              <a
                role="tab"
                className={`tab rounded-md transition-all duration-300 ${
                  activeTab === "submissions"
                    ? "tab-active"
                    : "hover:bg-base-content/5"
                }`}
                onClick={() => setActiveTab("submissions")}
              >
                Submissions{" "}
                <div className="badge badge-info rounded-full badge-soft ml-2">
                  {submissionCount}
                </div>
              </a>
            </div>
            {activeTab === "description" && (
              <div className="prose prose-lg max-w-none text-base-content/90 bg-base-200/30 p-6 rounded-lg">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {challenge.requirements}
                </ReactMarkdown>
              </div>
            )}
            {activeTab === "submissions" && (
              <PublicSubmissionList
                submissions={submissions}
                isLoading={false}
              />
            )}
          </div>
          {/* 5. CONSOLIDATED SIDEBAR */}
          <ChallengeSidebar
            challenge={challenge}
            onOpenModal={() => setIsModalOpen(true)}
          />
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
                onSuccess={handleSuccessfulSubmission}
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

export default ChallengeDetailsClient;
