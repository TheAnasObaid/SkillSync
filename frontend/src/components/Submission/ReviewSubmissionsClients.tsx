"use client";

import ConfirmationModal from "@/components/Common/ConfirmationModal";
import { useReviewSubmissions } from "@/hooks/useReviewSubmissions";
import { IChallenge, ISubmission } from "@/types";
import { FiAward } from "react-icons/fi";
import RatingModal from "./RatingModal";
import SubmissionsTable from "./SubmissionsTable";

interface Props {
  initialChallenge: IChallenge;
  initialSubmissions: ISubmission[];
}

const ReviewSubmissionsClient = ({
  initialChallenge,
  initialSubmissions,
}: Props) => {
  const {
    expandedId,
    setExpandedId,
    isUpdating,
    statusFilter,
    setStatusFilter,
    sortOrder,
    selectedSubmission,
    setSortOrder,
    filteredAndSortedSubmissions,
    isChallengeCompleted,
    ratingForm,
    isRatingModalOpen,
    openRatingModal,
    winnerModal,
    openWinnerModal,
    closeModal,
    handleRateSubmit,
    handleSelectWinner,
  } = useReviewSubmissions(initialSubmissions);

  const winnerName =
    winnerModal.submission &&
    typeof winnerModal.submission.developerId === "object" &&
    winnerModal.submission.developerId.profile
      ? winnerModal.submission.developerId.profile.firstName
      : "the selected developer";

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">{initialChallenge.title}</h1>
        <p className="text-base-content/70 mt-1">
          Review all submitted solutions.
        </p>
      </div>

      {isChallengeCompleted && (
        <div className="alert alert-success">
          <FiAward /> A winner has been selected!
        </div>
      )}

      <SubmissionsTable
        submissions={filteredAndSortedSubmissions}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        expandedId={expandedId}
        onExpand={setExpandedId}
        onRate={openRatingModal}
        onSelectWinner={openWinnerModal}
        isCompleted={isChallengeCompleted}
      />

      {/* --- MODALS --- */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={closeModal}
        onSubmit={handleRateSubmit}
        formMethods={ratingForm}
        isSubmitting={isUpdating}
        submission={selectedSubmission}
      />
      <ConfirmationModal
        isOpen={winnerModal.isOpen}
        title="Confirm Winner Selection"
        message={`Select submission by ${winnerName}?`}
        variant="primary"
        onConfirm={handleSelectWinner}
        onCancel={closeModal}
        confirmText="Confirm & Select"
        isActionInProgress={isUpdating}
      />
    </>
  );
};

export default ReviewSubmissionsClient;
