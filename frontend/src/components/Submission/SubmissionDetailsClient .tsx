"use client";

import { IChallenge, ISubmission, IUser } from "@/types";
import Link from "next/link";
import {
  FiAward,
  FiCalendar,
  FiExternalLink,
  FiGithub,
  FiUser,
} from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import UserAvatar from "../Profile/UserAvatar";

interface Props {
  submission: ISubmission & {
    developerId: IUser;
    challengeId: IChallenge;
  };
}

const statusStyles: { [key: string]: { base: string; text: string } } = {
  pending: { base: "bg-info/10", text: "text-info" },
  reviewed: { base: "bg-warning/10", text: "text-warning" },
  winner: { base: "bg-success/10", text: "text-success" },
  rejected: { base: "bg-error/10", text: "text-error" },
};

const SubmissionDetailsClient = ({ submission }: Props) => {
  const { developerId: developer, challengeId: challenge } = submission;
  const statusStyle = statusStyles[submission.status] || statusStyles.pending;
  const submissionDate = new Date(submission.createdAt).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );
  const challengeDeadline = new Date(challenge.deadline).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* --- HEADER --- */}
      <header className="mb-8">
        <p className="text-primary font-semibold">
          Submission for: {challenge.title}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2">
          Solution by {developer.profile.firstName}
        </h1>
        <div className="flex items-center gap-4 mt-4 text-base-content/70">
          <span>Submitted on {submissionDate}</span>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${statusStyle.base} ${statusStyle.text}`}
          >
            {submission.status}
          </span>
        </div>
      </header>

      <div className="divider" />

      {/* --- MAIN LAYOUT --- */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-12 mt-8">
        {/* --- Left Column: Submission Details --- */}
        <main className="space-y-8">
          {/* Description Card */}
          <div className="card bg-base-200/50 border border-base-300">
            <div className="card-body">
              <h2 className="card-title">Developer's Description</h2>
              <div className="prose max-w-none text-base-content/80 mt-2">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {submission.description}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Links Card */}
          <div className="card bg-base-200/50 border border-base-300">
            <div className="card-body">
              <h2 className="card-title">Project Links</h2>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <a
                  href={submission.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-neutral flex-1"
                >
                  <FiGithub /> View on GitHub
                </a>
                {submission.liveDemo && (
                  <a
                    href={submission.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary flex-1"
                  >
                    <FiExternalLink /> View Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* --- Right Column: Sidebar --- */}
        <aside className="space-y-6">
          {/* Author Card */}
          <div className="card bg-base-200/50 border border-base-300">
            <div className="card-body items-center text-center">
              <UserAvatar
                name={developer.profile.firstName}
                avatarUrl={developer.profile.avatar}
                className="w-20 h-20 text-3xl"
              />
              <h3 className="font-bold text-xl mt-2">
                {developer.profile.firstName} {developer.profile.lastName}
              </h3>
              <p className="text-sm text-base-content/60 -mt-1">
                {developer.email}
              </p>
              <Link
                href={`/users/${developer._id}`}
                className="btn btn-ghost btn-sm mt-4"
              >
                <FiUser /> View Profile
              </Link>
            </div>
          </div>
          {/* Challenge Info Card */}
          <div className="card bg-base-200/50 border border-base-300">
            <div className="card-body">
              <h3 className="card-title text-base mb-2">Challenge Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <FiAward className="text-primary flex-shrink-0" />
                  <span>
                    Prize:{" "}
                    <span className="font-semibold text-base-content">
                      ${challenge.prize.toLocaleString()}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCalendar className="text-error flex-shrink-0" />
                  <span>
                    Deadline:{" "}
                    <span className="font-semibold text-base-content">
                      {challengeDeadline}
                    </span>
                  </span>
                </div>
              </div>
              <div className="card-actions justify-center mt-4">
                <Link
                  href={`/challenges/${challenge._id}`}
                  className="btn btn-outline btn-xs"
                >
                  View Original Challenge
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SubmissionDetailsClient;
