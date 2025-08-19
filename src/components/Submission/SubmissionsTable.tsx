"use client";

import { Prisma, SubmissionStatus } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  FiAward,
  FiChevronDown,
  FiChevronUp,
  FiDownload,
  FiExternalLink,
  FiGithub,
  FiInfo,
  FiStar,
} from "react-icons/fi";
import UserAvatar from "../Profile/UserAvatar";

// 1. Define the exact shape of the submission data this table needs, including the nested developer.
const submissionWithDeveloper =
  Prisma.validator<Prisma.SubmissionDefaultArgs>()({
    include: { developer: true },
  });

// 2. Infer the type from the validator.
type SubmissionWithDeveloper = Prisma.SubmissionGetPayload<
  typeof submissionWithDeveloper
>;

interface Props {
  submissions: SubmissionWithDeveloper[];
  onRate: (submission: SubmissionWithDeveloper) => void;
  onSelectWinner: (submission: SubmissionWithDeveloper) => void;
  isCompleted: boolean;
}

const SubmissionsTable = ({
  submissions: initialSubmissions = [],
  onRate,
  onSelectWinner,
  isCompleted,
}: Props) => {
  // Internal state for filtering and sorting is a good pattern for client components.
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  const filteredAndSortedSubmissions = useMemo(() => {
    return initialSubmissions
      .filter((sub) => statusFilter === "all" || sub.status === statusFilter)
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [initialSubmissions, statusFilter, sortOrder]);

  const statusStyles: Record<SubmissionStatus, string> = {
    PENDING: "badge-info",
    REVIEWED: "badge-warning",
    WINNER: "badge-success",
    REJECTED: "badge-error",
  };

  return (
    <div className="space-y-6">
      <div className="card bg-base-200/50 border border-base-300">
        <div className="card-body p-4 flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="card-title text-lg">
            Submissions ({filteredAndSortedSubmissions.length})
          </h2>
          <div className="flex items-center gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select select-bordered select-sm"
            >
              <option value="all">Filter: All</option>
              <option value={SubmissionStatus.PENDING}>Pending</option>
              <option value={SubmissionStatus.REVIEWED}>Reviewed</option>
              <option value={SubmissionStatus.WINNER}>Winner</option>
              <option value={SubmissionStatus.REJECTED}>Rejected</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="select select-bordered select-sm"
            >
              <option value="desc">Sort: Newest</option>
              <option value="asc">Sort: Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {filteredAndSortedSubmissions.length === 0 ? (
        <div className="text-center py-12 card bg-base-200/50 border border-base-300">
          <FiInfo className="mx-auto text-4xl text-base-content/50 mb-4" />
          <p className="font-semibold">No Submissions Found</p>
          <p className="text-base-content/70">
            Try adjusting your filter settings.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedSubmissions.map((sub) => {
            const developer = sub.developer;
            const isExpanded = expandedId === sub.id;

            return (
              <div
                key={sub.id}
                className={`card bg-base-200/50 border border-base-300 transition-all duration-300 ${
                  isExpanded ? "border-primary/50" : ""
                } ${sub.status === "WINNER" ? "bg-success/10" : ""}`}
              >
                <div
                  className="card-body p-4 flex flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                >
                  <div className="flex items-center gap-4 flex-grow">
                    <UserAvatar
                      name={developer.firstName}
                      avatarUrl={developer.image}
                      className="w-12 h-12"
                    />
                    <div>
                      <p className="font-bold text-lg">{developer.firstName}</p>
                      <p className="text-sm text-base-content/60">
                        {developer.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span
                        className={`badge badge-outline capitalize ${
                          statusStyles[sub.status]
                        }`}
                      >
                        {sub.status.toLowerCase()}
                      </span>
                      {sub.rating && (
                        <div className="flex items-center gap-1 text-warning mt-1">
                          {[...Array(sub.rating)].map((_, i) => (
                            <FiStar key={i} fill="currentColor" size={16} />
                          ))}
                        </div>
                      )}
                    </div>
                    <button className="btn btn-ghost btn-sm btn-circle">
                      {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  </div>
                </div>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isExpanded ? "max-h-[500px]" : "max-h-0"
                  }`}
                >
                  <div className="px-4 pb-4">
                    <div className="divider my-0" />
                    <div className="grid md:grid-cols-[2fr_1fr] gap-x-8 gap-y-4 py-4">
                      <div className="prose prose-sm max-w-none text-base-content/80">
                        <h4>Description</h4>
                        <p>{sub.description || "No description provided."}</p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">
                            Links & Files
                          </h4>
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={sub.githubRepo}
                              target="_blank"
                              className="btn btn-ghost btn-xs"
                            >
                              <FiGithub /> GitHub
                            </Link>
                            {sub.liveDemo && (
                              <Link
                                href={sub.liveDemo}
                                target="_blank"
                                className="btn btn-ghost btn-xs"
                              >
                                <FiExternalLink /> Live Demo
                              </Link>
                            )}
                            {(sub.files as any[])?.map((file: any) => (
                              <a
                                key={file.path}
                                href={file.path}
                                download={file.name}
                                className="btn btn-ghost btn-xs"
                              >
                                <FiDownload /> {file.name}
                              </a>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-2">
                            Actions
                          </h4>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => onRate(sub)}
                            >
                              <FiStar /> Rate Submission
                            </button>
                            {!isCompleted && (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => onSelectWinner(sub)}
                              >
                                <FiAward /> Select as Winner
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubmissionsTable;
