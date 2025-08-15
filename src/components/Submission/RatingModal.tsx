"use client";

import { ISubmission } from "@/types";
import { FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";
import StarRating from "../Common/StarRating";
import { Textarea } from "../Forms/FormFields";
import { FiX } from "react-icons/fi";

interface RatingFormData {
  rating: number;
  feedback: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<RatingFormData>;
  formMethods: UseFormReturn<RatingFormData>;
  isSubmitting: boolean;
  submission: ISubmission | null;
}

const RatingModal = ({
  isOpen,
  onClose,
  onSubmit,
  formMethods,
  isSubmitting,
  submission,
}: Props) => {
  const { register, handleSubmit, watch, setValue } = formMethods;
  const ratingValue = watch("rating");
  const developerName =
    submission && typeof submission.developerId === "object"
      ? submission.developerId.profile.firstName
      : "";

  if (!isOpen) return null;

  return (
    <dialog open className="modal modal-open bg-black/30 backdrop-blur-sm">
      <div className="modal-box">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          <FiX />
        </button>
        <h3 className="font-bold text-lg">
          Review Submission from{" "}
          <span className="text-primary">{developerName}</span>
        </h3>
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mt-4">
            <div>
              <label className="label">
                <span className="label-text">Overall Rating</span>
              </label>
              <StarRating
                value={ratingValue}
                onChange={(rating) =>
                  setValue("rating", rating, { shouldValidate: true })
                }
              />
              <input
                type="hidden"
                {...register("rating", { required: true, min: 1 })}
              />
            </div>

            <Textarea
              name="feedback"
              label="Feedback"
              placeholder="Provide constructive feedback..."
              rows={4}
            />

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner" />
                ) : (
                  "Save Review"
                )}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </dialog>
  );
};

export default RatingModal;
