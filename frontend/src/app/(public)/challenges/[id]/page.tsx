"use client";

import ChallengeDetailsClient from "@/components/Challenge/ChallengeDetailsClient";
import { useSocket } from "@/context/SocketContext";
import { getChallengeByIdClient } from "@/services/client/challengeService";
import { getSubmissonsClient } from "@/services/client/submissionService";
import { IChallenge, ISubmission } from "@/types";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const ChallengeDetailsPage = () => {
  const { id } = useParams();
  const socket = useSocket(); // <-- Get the socket instance

  const [challenge, setChallenge] = useState<IChallenge | null>(null);
  const [submissions, setSubmissions] = useState<ISubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchChallengeData = useCallback(async () => {
    if (!id) return;

    // Keep loading true at the start of a fetch
    setLoading(true);
    setError("");
    try {
      const [challengeData, submissionsData] = await Promise.all([
        getChallengeByIdClient(id as string),
        getSubmissonsClient(id as string),
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
  }, [id]);

  useEffect(() => {
    fetchChallengeData();
  }, [fetchChallengeData]);

  useEffect(() => {
    if (socket && id) {
      // Join the "room" for this specific challenge
      socket.emit("join_challenge_room", id);

      const handleNewSubmission = (newSubmission: ISubmission) => {
        // Add the new submission to the top of the list
        setSubmissions((prevSubmissions) => [
          newSubmission,
          ...prevSubmissions,
        ]);
      };

      // Listen for the event from the server
      socket.on("new_submission_for_challenge", handleNewSubmission);

      // Clean up on component unmount
      return () => {
        socket.off("new_submission_for_challenge", handleNewSubmission);
        socket.emit("leave_challenge_room", id);
      };
    }
  }, [socket, id]);

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
      challenge={challenge}
      submissions={submissions || []}
      onSubmissionSuccess={fetchChallengeData}
    />
  );
};

export default ChallengeDetailsPage;
