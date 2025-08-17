"use client";

import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { TextInput, Textarea } from "../Forms/FormFields";
import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { Submission } from "@prisma/client";

export interface EditSubmissionFormData {
  githubRepo: string;
  liveDemo?: string;
  description: string;
}

interface EditSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditSubmissionFormData) => void;
  isSubmitting: boolean;
  submission: Submission | null;
}

const EditSubmissionModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  submission,
}: EditSubmissionModalProps) => {
  const formMethods = useForm<EditSubmissionFormData>();
  const { handleSubmit, reset } = formMethods;

  useEffect(() => {
    if (submission) {
      reset({
        githubRepo: submission.githubRepo,
        liveDemo: submission.liveDemo || "",
        description: submission.description,
      });
    }
  }, [submission, reset]);

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
        <h3 className="font-bold text-lg">Edit Your Submission</h3>

        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <TextInput
              name="githubRepo"
              label="GitHub Repository URL"
              type="url"
              required
            />
            <TextInput
              name="liveDemo"
              label="Live Demo URL (Optional)"
              type="url"
            />
            <Textarea
              name="description"
              label="Description"
              rows={4}
              required
            />
            <div className="modal-action">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
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
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </dialog>
  );
};

export default EditSubmissionModal;
