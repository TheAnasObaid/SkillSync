"use client";

import { useState } from "react";
import { FiClock, FiUsers } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SubmissionModal from "../Common/SubmissionModal";
import UserAvatar from "../Profile/UserAvatar";
import ChallengeSidebar from "./ChallengeSidebar";
import { Prisma, ChallengeDifficulty } from "@prisma/client";
import PublicSubmissionList from "../Submission/PublicSubmissionList";

const challengeWithCreator = Prisma.validator<Prisma.ChallengeDefaultArgs>()({
  include: {
    createdBy: {
      select: {
        id: true,
        firstName: true,
        companyName: true,
        image: true,
      },
    },
  },
});
// --------------------
type ChallengeWithCreator = Prisma.ChallengeGetPayload<
  typeof challengeWithCreator
>;

const submissionWithDeveloper =
  Prisma.validator<Prisma.SubmissionDefaultArgs>()({
    include: {
      developer: {
        select: {
          id: true,
          firstName: true,
          image: true,
        },
      },
    },
  });
type SubmissionWithDeveloper = Prisma.SubmissionGetPayload<
  typeof submissionWithDeveloper
>;

interface Props {
  initialChallenge: ChallengeWithCreator;
  initialSubmissions: SubmissionWithDeveloper[];
}

const ChallengeDetailsClient = ({
  initialChallenge,
  initialSubmissions,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "submissions">(
    "description"
  );

  const challenge = initialChallenge;
  const submissions = initialSubmissions;

  const formattedDeadline = new Date(challenge.deadline).toLocaleDateString(
    undefined,
    { year: "numeric", month: "long", day: "numeric" }
  );
  const submissionCount = submissions.length;
  const client = challenge.createdBy;

  const difficultyStyles: Record<ChallengeDifficulty, string> = {
    BEGINNER: "badge-success",
    INTERMEDIATE: "badge-warning",
    ADVANCED: "badge-error",
  };

  return (
    <>
      <div className="card bg-base-200/50 border border-base-300">
        <div className="max-w-6xl w-full mx-auto px-4 py-8">
          {client && (
            <div className="flex items-center gap-3 mb-4">
              <UserAvatar
                name={client.firstName}
                image={client.image}
                className="w-10 h-10"
              />
              <div>
                <p className="text-sm text-base-content/70">Posted by</p>
                <p className="font-semibold">
                  {client.companyName || client.firstName}
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
              <PublicSubmissionList submissions={submissions} />
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
        onClose={() => setIsModalOpen(false)}
        challengeId={challenge.id}
      />
    </>
  );
};

export default ChallengeDetailsClient;
