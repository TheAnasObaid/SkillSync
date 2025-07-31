"use client";
"use client";

import ChallengeDetailsClient from "@/components/Challenge/ChallengeDetailsClient";
import { getChallengeByIdClient } from "@/services/client/challengeService";
import { getPublicSubmissionsClient } from "@/services/client/submissionService";
import { IChallenge, ISubmission } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

const ChallengeDetailsPage = () => {
  const { id } = useParams();

  const [challenge, setChallenge] = useState<IChallenge | null>(null);
  const [submissions, setSubmissions] = useState<ISubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchChallengeData = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError("");
    try {
      const [challengeData, submissionsData] = await Promise.all([
        getChallengeByIdClient(id as string),
        getPublicSubmissionsClient(id as string),
      ]);

      if (!challengeData) {
        setError("Challenge not found.");
      } else {
        setChallenge(challengeData);
        setSubmissions(submissionsData);
      }
    } catch (err) {
      setError("Failed to load challenge details.");
    } finally {
      setLoading(false);
    }
  }, [id]); // The dependency is the `id` from the URL

  // Initial fetch on component mount
  useEffect(() => {
    fetchChallengeData();
  }, [fetchChallengeData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  if (error || !challenge) {
    return <p className="text-error">{error}</p>;
  }

  return (
    <ChallengeDetailsClient
      initialChallenge={challenge}
      initialSubmissions={submissions || []}
      onSubmissionSuccess={fetchChallengeData}
    />
  );
};

export default ChallengeDetailsPage;
