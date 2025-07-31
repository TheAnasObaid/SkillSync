"use client"; // We keep "use client" in case we add interactive buttons later

import Link from "next/link";
import { FiAward, FiClock, FiExternalLink } from "react-icons/fi";
import { ISubmission } from "@/types";
import NoSubmissions from "./NoSubmissions";

interface Props {
  submissions: ISubmission[];
}

const DeveloperSubmissionList = ({ submissions }: Props) => {
  const statusStyles: { [key: string]: string } = {
    pending: "badge-info",
    reviewed: "badge-ghost",
    winner: "badge-success",
    rejected: "badge-error",
  };

  if (submissions.length === 0) {
    return <NoSubmissions />;
  }

  return (
    <div className="space-y-4">
      {submissions.map((sub) => {
        if (typeof sub.challengeId === "string") {
          console.warn(`Submission ${sub._id} has an unpopulated challengeId.`);
          return null;
        }
        return (
          <div
            key={sub._id}
            className="card bg-base-200/50 border border-base-300 shadow-md transition-all hover:border-primary/50"
          >
            <div className="card-body p-6">
              <div className="flex justify-between items-start gap-4">
                <h3 className="card-title text-xl font-bold">
                  {sub.challengeId.title}
                </h3>
                <div
                  className={`badge badge-outline ${statusStyles[sub.status]}`}
                >
                  {sub.status}
                </div>
              </div>

              <div className="flex justify-between items-end mt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <FiAward />
                    <span>
                      ${sub.challengeId.prize?.toLocaleString() || "N/A"} Prize
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-base-content/70">
                    <FiClock />
                    <span>
                      Submitted on:{" "}
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/challenges/${sub.challengeId._id}`}
                  className="btn btn-outline btn-sm"
                >
                  View Challenge <FiExternalLink className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DeveloperSubmissionList;
