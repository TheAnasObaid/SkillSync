"use client";

import PublicSubmissionList from "@/components/Submission/PublicSubmissionList";
import SubmissionForm from "@/components/Submission/SubmissionForm";
import { useAuthStore } from "@/store/authStore";
import { IChallenge, ISubmission } from "@/types";
import { useEffect, useState } from "react";
import {
  FiAward,
  FiCheckCircle,
  FiClock,
  FiDownload,
  FiHash,
} from "react-icons/fi";
import CtaBlock from "./CtaBlock";
import { useSocket } from "@/context/SocketContext";

interface Props {
  initialChallenge: IChallenge | null;
  initialSubmissions?: ISubmission[];
  onSubmissionSuccess: () => void;
}

const ChallengeDetailsClient = ({
  initialChallenge,
  initialSubmissions,
  onSubmissionSuccess,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "submissions">(
    "description"
  );
  const [hasMounted, setHasMounted] = useState(false);
  const { user } = useAuthStore();
  const [challenge, setChallenge] = useState(initialChallenge);
  const [submissions, setSubmissions] = useState(initialSubmissions || []);

  const socket = useSocket();

  // --- NEW: REAL-TIME LOGIC ---
  useEffect(() => {
    // Make sure the socket connection exists before proceeding
    if (!socket) return;

    const challengeId = initialChallenge?._id;

    // 1. Join the room when the component mounts
    socket.emit("join_challenge_room", challengeId);
    console.log(`Attempting to join room: ${challengeId}`);

    // 2. Listen for incoming new submissions
    const handleNewSubmission = (newSubmission: ISubmission) => {
      // Add the new submission to the top of the list
      setSubmissions((prevSubmissions) => [newSubmission, ...prevSubmissions]);
    };
    socket.on("new_submission_for_challenge", handleNewSubmission);

    // 3. Clean up when the component unmounts
    return () => {
      console.log(`Leaving room: ${challengeId}`);
      socket.emit("leave_challenge_room", challengeId);
      socket.off("new_submission_for_challenge", handleNewSubmission);
    };
  }, [socket, initialChallenge?._id]); // Re-run effect if socket or challenge ID changes

  const submissionCount = submissions?.length;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setSubmissionSuccess(false), 300);
  };

  const formattedDeadline = new Date(
    initialChallenge!.deadline
  ).toLocaleDateString();

  const difficultyStyles = {
    beginner: "badge-success",
    intermediate: "badge-warning",
    advanced: "badge-error",
  };

  const handleSuccessfulSubmission = () => {
    setSubmissionSuccess(true);
    onSubmissionSuccess();
  };

  if (challenge)
    return (
      <>
        <div className="max-w-6xl w-full mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <h1 className="text-4xl md:text-5xl font-bold">
                {challenge.title}
              </h1>

              <div role="tablist" className="tabs tabs-bordered">
                <a
                  role="tab"
                  className={`tab ${
                    activeTab === "description" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </a>
                <a
                  role="tab"
                  className={`tab ${
                    activeTab === "submissions" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("submissions")}
                >
                  Submissions ({submissionCount})
                </a>
              </div>

              {activeTab === "description" && (
                <div className="prose max-w-none text-base-content/80">
                  <h2 className="text-2xl font-semibold text-base-content">
                    Description
                  </h2>
                  <p>{challenge.description}</p>
                  <h2 className="text-2xl font-semibold text-base-content mt-8">
                    Requirements
                  </h2>
                  <p>{challenge.requirements}</p>
                </div>
              )}
              {activeTab === "submissions" && submissions && (
                <PublicSubmissionList
                  submissions={submissions} // This prop is now live!
                  isLoading={false}
                />
              )}
            </div>
            <aside className="space-y-6 lg:sticky top-24 h-fit">
              <div className="card bg-base-200/50 border border-base-300">
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    <FiAward className="text-primary text-2xl mt-1" />
                    <div>
                      <h3 className="font-semibold text-base-content/70">
                        Prize
                      </h3>
                      <p className="text-3xl font-bold text-primary">
                        ${challenge.prize.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="divider my-2" />
                  <div className="flex items-center gap-4">
                    <FiClock className="text-base-content/70 text-xl" />
                    <div>
                      <h3 className="font-semibold text-base-content/70">
                        Deadline
                      </h3>
                      <p className="font-semibold">{formattedDeadline}</p>
                    </div>
                  </div>
                  <div className="divider my-2" />
                  <div className="flex items-start gap-4">
                    <FiHash className="text-base-content/70 text-xl mt-1" />
                    <div>
                      <h3 className="font-semibold text-base-content/70 mb-2">
                        Info
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <div
                          className={`badge badge-outline ${
                            difficultyStyles[challenge.difficulty]
                          }`}
                        >
                          {challenge.difficulty}
                        </div>
                        {challenge.tags.map((tag) => (
                          <div
                            key={tag}
                            className="badge badge-neutral badge-outline font-mono text-xs"
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {challenge.files && challenge.files.length > 0 && (
                <div className="card bg-base-200/50 border border-base-300">
                  <div className="card-body">
                    <h3 className="card-title">Attached Resources</h3>
                    <div className="space-y-2 mt-2">
                      {challenge.files.map((file, index) => (
                        <a
                          key={index}
                          href={`${
                            process.env.NEXT_PUBLIC_API_BASE_URL
                          }/${file.path.replace(/\\/g, "/")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-block"
                          download={file.name}
                        >
                          <FiDownload className="mr-2" /> {file.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {hasMounted ? (
                user ? (
                  <CtaBlock
                    role={user.role}
                    onOpenModal={() => setIsModalOpen(true)}
                  />
                ) : (
                  <CtaBlock role={null} onOpenModal={() => {}} />
                )
              ) : (
                <div className="skeleton h-12 w-full"></div>
              )}
            </aside>
          </div>
        </div>

        <dialog
          id="submission_modal"
          className={`modal ${isModalOpen ? "modal-open" : ""}`}
        >
          <div className="modal-box relative border border-base-300">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={handleModalClose}
            >
              ✕
            </button>

            {submissionSuccess ? (
              <div className="text-center p-8 space-y-4">
                <FiCheckCircle className="text-success text-6xl mx-auto" />
                <h3 className="font-bold text-2xl">Submission Successful!</h3>
                <p className="text-base-content/70">
                  Your solution has been submitted for review. Good luck!
                </p>
                <div className="modal-action justify-center mt-4">
                  <button
                    className="btn btn-primary"
                    onClick={handleModalClose}
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-lg mb-6">Submit Your Solution</h3>
                <SubmissionForm
                  challengeId={initialChallenge!._id}
                  onSuccess={handleSuccessfulSubmission}
                />
              </>
            )}
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={handleModalClose}>close</button>
          </form>
        </dialog>
      </>
    );
};

export default ChallengeDetailsClient;
