"use client";

import { useState } from "react";
import Modal from "../Common/Modal";
import SuccessDisplay from "../Common/SuccessDisplay";
import SubmissionForm from "../Submission/SubmissionForm";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  challengeId: string;
  onSubmissionSuccess: () => void;
}

const SubmissionModal = ({
  isOpen,
  onClose,
  challengeId,
  onSubmissionSuccess,
}: SubmissionModalProps) => {
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleSuccess = () => {
    setSubmissionSuccess(true);
    onSubmissionSuccess();
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
