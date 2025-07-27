"use client";

import apiClient from "@/services/apiClient";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Challenge } from "@/components/Challenge/ChallengeCard";
import SubmissionForm from "@/components/Submission/SubmissionForm";
import Link from "next/link";
import { useParams } from "next/navigation";

const ChallengeDetailsPage = () => {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();
  const { role } = useAuthStore();

  useEffect(() => {
    if (!id) return;

    const fetchChallenge = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/challenges/${id}`);
        setChallenge(response.data);
      } catch (err) {
        setError("Challenge not found or failed to load.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !challenge) {
    return <p className="text-center text-error p-10">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-base-100 p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold">{challenge.title}</h1>
          <span className="text-2xl font-bold text-secondary">
            ${challenge.prize}
          </span>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <span className="badge badge-lg">{challenge.difficulty}</span>
          <span className="text-gray-500">
            Deadline: {new Date(challenge.deadline).toLocaleDateString()}
          </span>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold">Description</h2>
          <p>{challenge.description}</p>

          <h2 className="text-2xl font-semibold mt-6">Requirements</h2>
          <p>{challenge.requirements}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {challenge.tags.map((tag) => (
            <div key={tag} className="badge badge-outline">
              {tag}
            </div>
          ))}
        </div>

        <div className="divider mt-8"></div>

        <div className="text-center mt-6">
          {role === "developer" && (
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setIsModalOpen(true)}
            >
              Submit Your Solution
            </button>
          )}
          {role === "client" && (
            <p className="text-lg text-info">You are logged in as a client.</p>
          )}
          {!role && (
            <p className="text-lg text-info">
              <Link href="/login" className="link">
                Log in
              </Link>{" "}
              as a developer to submit a solution.
            </p>
          )}
        </div>

        {isModalOpen && (
          <dialog id="submission_modal" className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Submit Your Solution</h3>
              <SubmissionForm
                challengeId={challenge._id}
                onSuccess={() => {
                  setIsModalOpen(false);
                  alert("Submission successful!");
                }}
              />
              <div className="modal-action">
                <button className="btn" onClick={() => setIsModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default ChallengeDetailsPage;
