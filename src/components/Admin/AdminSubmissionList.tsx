"use client";

import { useAllSubmissionsQuery } from "@/hooks/queries/useAdminQueries";
import { SubmissionStatus } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { FiChevronRight } from "react-icons/fi";
import EmptyState from "../Common/EmptyState";
import UserAvatar from "../Profile/UserAvatar";

const AdminSubmissionList = () => {
  const router = useRouter();
  const { data: submissions, isLoading, isError } = useAllSubmissionsQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton h-20 w-full rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (isError || !submissions) {
    return (
      <div className="alert alert-error alert-soft">
        Could not load submissions.
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <EmptyState
        title="No Submissions Yet"
        message="When developers start submitting solutions, they will appear here for review."
        ctaText="View Open Challenges"
        ctaLink="/challenges"
      />
    );
  }
  const handleNestedLinkClick = (e: MouseEvent) => e.stopPropagation();

  const statusStyles: Record<SubmissionStatus, string> = {
    PENDING: "badge-warning",
    REVIEWED: "badge-info",
    WINNER: "badge-success",
    REJECTED: "badge-error",
  };

  return (
    <div className="space-y-4">
      {submissions.map((sub) => {
        const { developer, challenge } = sub;
        const handleCardClick = () =>
          router.push(`/challenges/${challenge.id}/submissions/${sub.id}`);

        return (
          <div
            key={sub.id}
            onClick={handleCardClick}
            className="card bg-base-200/50 border border-base-300 shadow-sm transition-all hover:border-primary/50 hover:shadow-md cursor-pointer"
          >
            <div className="card-body p-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <Link
                  href={`/users/${developer.id}`}
                  onClick={handleNestedLinkClick}
                  className="flex items-center gap-3 group/userlink"
                >
                  <UserAvatar
                    name={developer.firstName}
                    avatarUrl={developer.avatarUrl}
                  />
                  <div>
                    <p className="font-bold group-hover/userlink:link">
                      {developer.firstName}
                    </p>
                    <p className="text-sm text-base-content/60">
                      {developer.email}
                    </p>
                  </div>
                </Link>
                <div className="flex-grow">
                  <p className="text-sm text-base-content/70">Submitted to:</p>
                  <p className="font-semibold text-base-content link-hover">
                    {challenge.title}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span
                      className={`badge badge-soft capitalize ${
                        statusStyles[sub.status] || "badge-ghost"
                      }`}
                    >
                      {sub.status.toLowerCase()}
                    </span>
                    <p className="text-xs text-base-content/60 mt-1">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <FiChevronRight size={24} className="text-base-content/30" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminSubmissionList;
