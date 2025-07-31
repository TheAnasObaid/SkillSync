"use client";

import { getPublicSubmissionsClient } from "@/services/submissionService";
import { PublicSubmission } from "@/types";
import { useEffect, useState } from "react";
import { FiInbox } from "react-icons/fi";
import SubmissionCard from "./SubmissionCard";

interface Props {
  challengeId: string;
  onCountChange: (count: number) => void;
}

const PublicSubmissionList = ({ challengeId, onCountChange }: Props) => {
  const [submissions, setSubmissions] = useState<PublicSubmission[]>([]);

  useEffect(() => {
    if (challengeId) {
      getPublicSubmissionsClient(challengeId).then((data) =>
        setSubmissions(data)
      );
    }
  }, [challengeId, onCountChange]);

  if (submissions.length === 0) {
    return (
      <div className="text-center p-12 bg-base-200/50 border border-dashed border-base-300 rounded-lg">
        <FiInbox className="mx-auto text-5xl text-base-content/40 mb-4" />
        <h3 className="text-2xl font-bold">No Submissions Yet</h3>
        <p className="text-base-content/70 mt-2">
          Be the first to submit a solution for this challenge!
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {submissions.map((sub) => (
        <SubmissionCard key={sub._id} submission={sub} />
      ))}
    </div>
  );
};

export default PublicSubmissionList;
