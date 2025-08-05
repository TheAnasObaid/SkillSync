// ===== File: frontend\src\components\Submission\SubmissionsTable.tsx =====
import { ISubmission } from "@/types";
import Link from "next/link";
import { Fragment } from "react";
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

interface Props {
  submissions: ISubmission[];
  expandedId: string | null;
  sortOrder: string;
  isCompleted: boolean;
  statusFilter: string;
  onStatusChange: (newStatus: string) => void;
  onSortChange: (newOrder: string) => void;
  onExpand: (id: string | null) => void;
  onRate: (submission: ISubmission) => void;
  onSelectWinner: (submission: ISubmission) => void;
}

// Main component remains the same, but the rendered output is completely refactored.
const SubmissionsTable = ({
  submissions = [],
  expandedId,
  onExpand,
  onRate,
  onSelectWinner,
  isCompleted,
  statusFilter,
  sortOrder,
  onStatusChange,
  onSortChange,
}: Props) => {
  const statusStyles: { [key: string]: string } = {
    pending: "badge-info",
    reviewed: "badge-warning",
    winner: "badge-success",
    rejected: "badge-error",
  };

  return (
    <div className="space-y-6">
      {/* --- Filter and Sort Controls --- */}
      <div className="card bg-base-200/50 border border-base-300">
        <div className="card-body p-4 flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="card-title text-lg">
            Submissions ({submissions.length})
          </h2>
          <div className="flex items-center gap-4">
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="select select-bordered select-sm"
              aria-label="Filter submissions by status"
            >
              <option value="all">Filter: All</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="winner">Winner</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => onSortChange(e.target.value)}
              className="select select-bordered select-sm"
              aria-label="Sort submissions"
            >
              <option value="desc">Sort: Newest</option>
              <option value="asc">Sort: Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- Submissions List or Empty State --- */}
      {submissions.length === 0 ? (
        <div className="text-center py-12 card bg-base-200/50 border border-base-300">
          <FiInfo className="mx-auto text-4xl text-base-content/50 mb-4" />
          <p className="font-semibold">No Submissions Found</p>
          <p className="text-base-content/70">
            Try adjusting your filter settings.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => {
            const developer =
              typeof sub.developerId === "object" ? sub.developerId : null;
            if (!developer) return null;
            const isExpanded = expandedId === sub._id;

            return (
              <div
                key={sub._id}
                className={`card bg-base-200/50 border border-base-300 transition-all duration-300 ${
                  isExpanded ? "border-primary/50" : ""
                } ${sub.status === "winner" ? "bg-success/10" : ""}`}
              >
                {/* --- Main, always-visible card header --- */}
                <div
                  className="card-body p-4 flex flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
                  onClick={() => onExpand(isExpanded ? null : sub._id)}
                >
                  <div className="flex items-center gap-4 flex-grow">
                    <UserAvatar
                      name={developer.profile.firstName}
                      avatarUrl={developer.profile.avatar}
                      className="w-12 h-12"
                    />
                    <div>
                      <p className="font-bold text-lg">
                        {developer.profile.firstName}
                      </p>
                      <p className="text-sm text-base-content/60">
                        {developer.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span
                        className={`badge badge-outline ${
                          statusStyles[sub.status]
                        }`}
                      >
                        {sub.status}
                      </span>
                      {sub.ratings?.overall && (
                        <div className="flex items-center gap-1 text-warning mt-1">
                          {[...Array(sub.ratings.overall)].map((_, i) => (
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

                {/* --- Expandable Details Section with Animation --- */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isExpanded ? "max-h-[500px]" : "max-h-0"
                  }`}
                >
                  <div className="px-4 pb-4">
                    <div className="divider my-0" />
                    <div className="grid md:grid-cols-[2fr_1fr] gap-x-8 gap-y-4 py-4">
                      {/* Left side: Description */}
                      <div className="prose prose-sm max-w-none text-base-content/80">
                        <h4>Description</h4>
                        <p>{sub.description || "No description provided."}</p>
                      </div>
                      {/* Right side: Links, Files, and Actions */}
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
                            {sub.files?.map((file) => (
                              <a
                                key={file.path}
                                href={`${
                                  process.env.NEXT_PUBLIC_API_BASE_URL
                                }/${file.path.replace(/\\/g, "/")}`}
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
