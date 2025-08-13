"use client";

import { IChallenge, ISubmission } from "@/types";
import { useState } from "react";
import { FiClock, FiUsers } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SubmissionModal from "../Common/SubmissionModal";
import UserAvatar from "../Profile/UserAvatar";
import SubmissonList from "../Submission/PublicSubmissionList";
import ChallengeSidebar from "./ChallengeSidebar";

type LiveSubmission = ISubmission & { isNew?: boolean };

interface Props {
  challenge: IChallenge | null;
  submissions: LiveSubmission[];
  onSubmissionSuccess: () => void;
}

const difficultyStyles = {
  beginner: "badge-success",
  intermediate: "badge-warning",
  advanced: "badge-error",
};

const ChallengeDetailsClient = ({
  challenge,
  submissions,
  onSubmissionSuccess,
}: Props) => {
  // FIX: Removed the internal `useState` for `challenge` and `submissions`.
  // The component now renders directly from its props, making it a "dumb" component.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "submissions">(
    "description"
  );

  const handleModalClose = () => setIsModalOpen(false);

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
  // FIX: Directly use the length of the submissions prop.
  const submissionCount = submissions.length;

  const handleSuccessfulSubmission = () => {
    // The parent's socket listener will handle the data update.
    // We just need to trigger the parent to know the submission was successful,
    // which can be used for things like closing the modal or showing a toast.
    onSubmissionSuccess();
  };

  return (
    <>
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
              <div className="prose prose-lg max-w-none bg-base-200/30 p-6 rounded-lg text-base-content/90 prose-h2:text-xl prose-h2:mb-2 prose-p:my-2 prose-li:my-1">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {challenge.requirements}
                </ReactMarkdown>
              </div>
            )}

            {activeTab === "submissions" && (
              // FIX: Pass the submissions prop directly.
              <SubmissonList submissions={submissions} isLoading={false} />
            )}
          </div>
          <ChallengeSidebar
            challenge={challenge}
            onOpenModal={() => setIsModalOpen(true)}
          />
        </div>
      </div>
      <SubmissionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        challengeId={challenge._id}
        onSubmissionSuccess={handleSuccessfulSubmission}
      />
    </>
  );
};

export default ChallengeDetailsClient;
