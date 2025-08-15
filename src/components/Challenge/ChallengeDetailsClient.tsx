"use client";

import { IChallenge, ISubmission } from "@/types";
import { useState } from "react";
import { FiClock, FiUsers } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SubmissionModal from "../Common/SubmissionModal";
import UserAvatar from "../Profile/UserAvatar";
import PublicSubmissionList from "../Submission/PublicSubmissionList";
import ChallengeSidebar from "./ChallengeSidebar";
import { usePublicSubmissionsQuery } from "@/hooks/queries/useSubmissionQueries";

interface Props {
  initialChallenge: IChallenge;
  initialSubmissions: ISubmission[];
}

const ChallengeDetailsClient = ({
  initialChallenge,
  initialSubmissions,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "submissions">(
    "description"
  );

  const { data: submissions, isLoading } = usePublicSubmissionsQuery(
    initialChallenge._id,
    initialSubmissions
  );

  const challenge = initialChallenge;

  const formattedDeadline = new Date(challenge.deadline).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
  const submissionCount = submissions?.length ?? 0;
  const client =
    typeof challenge.createdBy === "object" ? challenge.createdBy : null;

  const difficultyStyles = {
    beginner: "badge-success",
    intermediate: "badge-warning",
    advanced: "badge-error",
  };

  return (
    <>
      <div className="card bg-base-200/50 border border-base-300">
        <div className="max-w-6xl w-full mx-auto px-4 py-8">
          {client?.profile && (
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
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-base-content/80">
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
                className={`tab ${
                  activeTab === "description" ? "tab-active" : ""
                }`}
                onClick={() => setActiveTab("description")}
              >
                Requirements
              </a>
              <a
                role="tab"
                className={`tab ${
                  activeTab === "submissions" ? "tab-active" : ""
                }`}
                onClick={() => setActiveTab("submissions")}
              >
                Submissions{" "}
                <div className="badge badge-info badge-soft ml-2">
                  {submissionCount}
                </div>
              </a>
            </div>
            {activeTab === "description" && (
              <div className="prose prose-lg max-w-none bg-base-200/30 p-6 rounded-lg">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {challenge.requirements}
                </ReactMarkdown>
              </div>
            )}
            {activeTab === "submissions" && (
              <PublicSubmissionList
                submissions={submissions || []}
                isLoading={isLoading}
              />
            )}
          </div>
          <ChallengeSidebar
            challenge={challenge}
            onOpenModal={() => setIsModalOpen(true)}
          />
        </div>
      </div>

      {/* 2. SIMPLIFIED MODAL: No more `onSubmissionSuccess` prop drilling! */}
      <SubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        challengeId={challenge._id}
      />
    </>
  );
};

export default ChallengeDetailsClient;
