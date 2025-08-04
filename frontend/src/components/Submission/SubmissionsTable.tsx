import { ISubmission } from "@/types";
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
import Link from "next/link";

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
    <div className="card bg-base-200/50 border border-base-300">
      <div className="card-body p-4 border-b border-base-300 flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="card-title text-lg">
          Submissions ({submissions.length})
        </h2>
        <div className="flex items-center gap-4">
          <div className="form-control">
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="select select-bordered select-sm"
            >
              <option value="all">Filter: All</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="winner">Winner</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="form-control">
            <select
              value={sortOrder}
              onChange={(e) => onSortChange(e.target.value)}
              className="select select-bordered select-sm"
            >
              <option value="desc">Sort: Newest</option>
              <option value="asc">Sort: Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-12 rounded-lg">
          <FiInfo className="mx-auto text-4xl mb-4" />
          <p>No submissions match your criteria.</p>
        </div>
      ) : (
        <div className="card bg-base-200/50 border border-base-300">
          <table className="table">
            <thead>
              <tr>
                <th className="w-px"></th>
                <th>Developer</th>
                <th>Status</th>
                <th>Rating</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => {
                const developer =
                  typeof sub.developerId === "object" ? sub.developerId : null;
                if (!developer) return null;

                return (
                  <Fragment key={sub._id}>
                    <tr
                      className={`transition-colors hover:bg-base-300/40 cursor-pointer ${
                        sub.status === "winner" ? "bg-success/10" : ""
                      }`}
                      onClick={() =>
                        onExpand(expandedId === sub._id ? null : sub._id)
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
                            name={developer.profile.firstName}
                            avatarUrl={developer.profile.avatar}
                          />
                          <div>
                            <div className="font-bold">
                              {developer.profile.firstName}
                            </div>
                            <div className="text-sm opacity-50">
                              {developer.email}
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
                            onRate(sub);
                          }}
                        >
                          <FiStar /> Rate
                        </button>
                        {!isCompleted && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectWinner(sub);
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
                          sub.status === "winner"
                            ? "bg-success/5"
                            : "bg-base-100/50"
                        }
                      >
                        <td></td>
                        <td colSpan={4} className="p-4">
                          <div className="p-2 space-y-4">
                            <div>
                              <h4 className="font-bold text-sm mb-1">
                                Description:
                              </h4>
                              <p className="text-base-content/80 text-sm whitespace-pre-wrap">
                                {sub.description || "No description provided."}
                              </p>
                            </div>

                            <div className="divider my-1"></div>
                            <div className="flex items-center gap-4 flex-wrap">
                              <h4 className="font-bold text-sm">Links:</h4>
                              <Link
                                href={sub.githubRepo}
                                target="_blank"
                                className="btn btn-ghost btn-xs"
                              >
                                <FiGithub /> GitHub Repo
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
                            </div>
                            {sub.files && sub.files.length > 0 && (
                              <div className="flex items-center gap-4 flex-wrap">
                                <h4 className="font-bold text-sm">Files:</h4>
                                {sub.files.map((file) => (
                                  <a
                                    key={file.path}
                                    href={`${
                                      process.env.NEXT_PUBLIC_API_BASE_URL
                                    }/${file.path.replace(/\\/g, "/")}`}
                                    download={file.name}
                                    className="btn btn-outline btn-xs"
                                  >
                                    <FiDownload /> {file.name}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubmissionsTable;
