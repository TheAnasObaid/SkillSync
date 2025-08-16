"use client";

import { useState } from "react";
import SubmissionForm from "../Submission/SubmissionForm";
import Modal from "./Modal";
import SuccessDisplay from "./SuccessDisplay";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  challengeId: string;
}

const SubmissionModal = ({
  isOpen,
  onClose,
  challengeId,
}: SubmissionModalProps) => {
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleSuccess = () => {
    setSubmissionSuccess(true);
  };

  const handleClose = () => {
    setTimeout(() => setSubmissionSuccess(false), 300);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        submissionSuccess ? "Submission Successful!" : "Submit Your Solution"
      }
    >
      {submissionSuccess ? (
        <SuccessDisplay
          title="Success!"
          message="Your solution has been submitted for review. Good luck!"
          onDone={handleClose}
        />
      ) : (
        <SubmissionForm challengeId={challengeId} onSuccess={handleSuccess} />
      )}
    </Modal>
  );
};

export default SubmissionModal;
