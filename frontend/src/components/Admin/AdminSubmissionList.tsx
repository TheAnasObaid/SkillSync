// ===== File: frontend\src/components\Admin\AdminSubmissionList.tsx =====
"use client"; // Required for hooks like useRouter

import { ISubmission } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { FiChevronRight } from "react-icons/fi";
import EmptyState from "../Common/EmptyState";
import UserAvatar from "../Profile/UserAvatar";

interface Props {
  submissions: ISubmission[];
}

const statusStyles: { [key: string]: string } = {
  pending: "badge-info",
  reviewed: "badge-ghost",
  winner: "badge-success",
  rejected: "badge-error",
};

const AdminSubmissionList = ({ submissions }: Props) => {
  const router = useRouter();

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

  // This handler prevents the main card's navigation when a nested link is clicked.
  const handleNestedLinkClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="space-y-4">
      {submissions.map((sub) => {
        // Safely access nested data
        const developer =
          typeof sub.developerId === "object" ? sub.developerId : null;
        const challenge =
          typeof sub.challengeId === "object" ? sub.challengeId : null;

        if (!developer || !challenge) {
          return null; // Don't render if data is missing
        }

        const handleCardClick = () => {
          router.push(`/challenges/${challenge._id}/submissions/${sub._id}`);
        };

        return (
          <div
            key={sub._id}
            onClick={handleCardClick}
            className="card bg-base-200/50 border border-base-300 shadow-sm transition-all duration-200 ease-in-out hover:border-primary/50 hover:shadow-md hover:-translate-y-px cursor-pointer"
          >
            <div className="card-body p-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Developer Info (Clickable) */}
                <Link
                  href={`/users/${developer._id}`}
                  onClick={handleNestedLinkClick}
                  className="flex items-center gap-3 group/userlink"
                >
                  <UserAvatar
                    name={developer.profile.firstName}
                    avatarUrl={developer.profile.avatar}
                  />
                  <div>
                    <p className="font-bold group-hover/userlink:link">
                      {developer.profile.firstName}
                    </p>
                    <p className="text-sm text-base-content/60">
                      {developer.email}
                    </p>
                  </div>
                </Link>

                {/* Challenge Info */}
                <div className="flex-grow">
                  <p className="text-sm text-base-content/70">Submitted to:</p>
                  <p className="font-semibold text-base-content link-hover">
                    {challenge.title}
                  </p>
                </div>

                {/* Status and Date */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span
                      className={`badge ${
                        statusStyles[sub.status] || "badge-ghost"
                      }`}
                    >
                      {sub.status}
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
