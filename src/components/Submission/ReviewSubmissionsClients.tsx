"use client";

import ConfirmationModal from "@/components/Common/ConfirmationModal";
import {
  useRateSubmissionMutation,
  useSelectWinnerMutation,
} from "@/hooks/mutations/useSubmissionMutations";
import { useSubmissionsForReviewQuery } from "@/hooks/queries/useSubmissionQueries";
import { IChallenge, ISubmission } from "@/types";
import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FiAward } from "react-icons/fi";
import RatingModal from "./RatingModal";
import SubmissionsTable from "./SubmissionsTable";

interface Props {
  initialChallenge: IChallenge;
}

interface RatingFormData {
  rating: number;
  feedback: string;
}

const ReviewSubmissionsClient = ({ initialChallenge }: Props) => {
  const challengeId = initialChallenge._id;

  const {
    data: submissions = [],
    isLoading,
    isError,
  } = useSubmissionsForReviewQuery(challengeId);

  const { mutate: rateMutate, isPending: isRating } =
    useRateSubmissionMutation();
  const { mutate: selectWinnerMutate, isPending: isSelectingWinner } =
    useSelectWinnerMutation();
  const isUpdating = isRating || isSelectingWinner;

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [ratingModal, setRatingModal] = useState({
    isOpen: false,
    submission: null as ISubmission | null,
  });
  const [winnerModal, setWinnerModal] = useState({
    isOpen: false,
    submission: null as ISubmission | null,
  });

  const ratingForm = useForm<RatingFormData>();

  const filteredAndSortedSubmissions = useMemo(() => {
    return submissions
      .filter((sub) => statusFilter === "all" || sub.status === statusFilter)
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [submissions, statusFilter, sortOrder]);

  const isChallengeCompleted = useMemo(
    () => submissions.some((s) => s.status === "winner"),
    [submissions]
  );
  const winnerName =
    winnerModal.submission &&
    typeof winnerModal.submission.developerId === "object"
      ? winnerModal.submission.developerId.profile.firstName
      : "this developer";

  const handleRateSubmit: SubmitHandler<RatingFormData> = (data) => {
    if (ratingModal.submission) {
      rateMutate(
        {
          submissionId: ratingModal.submission._id,
          payload: { rating: data.rating, feedback: data.feedback },
        },
        { onSuccess: () => setRatingModal({ isOpen: false, submission: null }) }
      );
    }
  };

  const handleSelectWinner = () => {
    if (winnerModal.submission) {
      selectWinnerMutate(winnerModal.submission._id, {
        onSuccess: () => setWinnerModal({ isOpen: false, submission: null }),
      });
    }
  };

  if (isLoading) return <div className="skeleton h-64 w-full"></div>;
  if (isError)
    return (
      <div className="alert alert-error">
        Could not load submissions for this challenge.
      </div>
    );

  return (
    <>
      {isChallengeCompleted && (
        <div className="alert alert-success mb-6">
          <FiAward /> A winner has been selected for this challenge!
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
        onRate={(sub) => {
          ratingForm.reset({
            rating: sub.ratings?.overall || 0,
            feedback: sub.feedback || "",
          });
          setRatingModal({ isOpen: true, submission: sub });
        }}
        onSelectWinner={(sub) =>
          setWinnerModal({ isOpen: true, submission: sub })
        }
        isCompleted={isChallengeCompleted}
      />

      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={() => setRatingModal({ isOpen: false, submission: null })}
        onSubmit={handleRateSubmit}
        formMethods={ratingForm}
        isSubmitting={isRating}
        submission={ratingModal.submission}
      />
      <ConfirmationModal
        isOpen={winnerModal.isOpen}
        title="Confirm Winner Selection"
        message={`Are you sure you want to select the submission by ${winnerName} as the winner? This action cannot be undone.`}
        variant="primary"
        onConfirm={handleSelectWinner}
        onCancel={() => setWinnerModal({ isOpen: false, submission: null })}
        confirmText="Yes, Select Winner"
        isActionInProgress={isSelectingWinner}
        icon={<FiAward size={48} />}
      />
    </>
  );
};

export default ReviewSubmissionsClient;
