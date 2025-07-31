"use client";

import apiClient from "@/lib/apiClient";
import { useEffect, useState } from "react";
import SubmissionCard, { PublicSubmission } from "./SubmissionCard";
import { FiInbox } from "react-icons/fi";

interface PublicSubmissionListProps {
  challengeId: string;
  onCountChange: (count: number) => void;
}

const PublicSubmissionList = ({
  challengeId,
  onCountChange,
}: PublicSubmissionListProps) => {
  const [submissions, setSubmissions] = useState<PublicSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(
          `/submissions/public/challenge/${challengeId}`
        );
        setSubmissions(response.data);
        onCountChange(response.data.length); // Update the count in the parent component
      } catch (error) {
        console.error("Failed to fetch public submissions:", error);
      } finally {
        setLoading(false);
      }
    };
    if (challengeId) {
      fetchSubmissions();
    }
  }, [challengeId, onCountChange]);

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

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
