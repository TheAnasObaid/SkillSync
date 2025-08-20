"use client";

import ConfirmationModal from "@/components/Common/ConfirmationModal";
import {
  useRateSubmissionMutation,
  useSelectWinnerMutation,
} from "@/hooks/mutations/useSubmissionMutations";
import { useSubmissionsForReviewQuery } from "@/hooks/queries/useSubmissionQueries";
import { SubmissionWithDeveloper } from "@/services/api/submissions";
import { Challenge } from "@prisma/client";
import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FiAward } from "react-icons/fi";
import RatingModal from "./RatingModal";
import SubmissionsTable from "./SubmissionsTable";

interface Props {
  initialChallenge: Challenge;
}

interface RatingFormData {
  rating: number;
  feedback: string;
}

const ReviewSubmissionsClient = ({ initialChallenge }: Props) => {
  const {
    data: submissions = [],
    isLoading,
    isError,
  } = useSubmissionsForReviewQuery(initialChallenge.id);

  const { mutate: rateMutate, isPending: isRating } =
    useRateSubmissionMutation();
  const { mutate: selectWinnerMutate, isPending: isSelectingWinner } =
    useSelectWinnerMutation();

  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean;
    submission: SubmissionWithDeveloper | null;
  }>({ isOpen: false, submission: null });
  const [winnerModal, setWinnerModal] = useState<{
    isOpen: boolean;
    submission: SubmissionWithDeveloper | null;
  }>({ isOpen: false, submission: null });

  const ratingForm = useForm<RatingFormData>();

  const isChallengeCompleted = useMemo(
    () => submissions.some((s) => s.status === "WINNER"),
    [submissions]
  );
  const winnerName =
    winnerModal.submission?.developer.firstName || "this developer";

  const handleRateSubmit: SubmitHandler<RatingFormData> = (data) => {
    if (ratingModal.submission) {
      rateMutate(
        {
          submissionId: ratingModal.submission.id,
          payload: { rating: data.rating, feedback: data.feedback },
        },
        { onSuccess: () => setRatingModal({ isOpen: false, submission: null }) }
      );
    }
  };

  const handleSelectWinner = () => {
    if (winnerModal.submission) {
      selectWinnerMutate(winnerModal.submission.id, {
        onSuccess: () => setWinnerModal({ isOpen: false, submission: null }),
      });
    }
  };

  if (isLoading) return <div className="skeleton h-64 w-full"></div>;
  if (isError)
    return <div className="alert alert-error">Could not load submissions.</div>;

  return (
    <>
      {isChallengeCompleted && (
        <div className="alert alert-success alert-soft mb-6">
          <FiAward /> A winner has been selected!
        </div>
      )}
      <SubmissionsTable
        submissions={submissions}
        onRate={(sub) => {
          ratingForm.reset({
            rating: sub.rating || 0,
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
        message={`Are you sure you want to select ${winnerName} as the winner?`}
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
