"use client";

import { FormProvider } from "react-hook-form";
import { TextInput, Textarea, FileInput } from "../Forms/FormFields";
import { useSubmissionForm } from "@/hooks/useSubmissionsForm";

interface Props {
  challengeId: string;
  onSuccess: () => void;
}

const SubmissionForm = ({ challengeId, onSuccess }: Props) => {
  const { form, isSubmitting, submitHandler } = useSubmissionForm(
    challengeId,
    onSuccess
  );

  return (
    <FormProvider {...form}>
      <form onSubmit={submitHandler} className="grid gap-4">
        <TextInput
          name="githubRepo"
          label="GitHub Repository URL"
          type="url"
          placeholder="https://github.com/user/repo"
          required
        />
        <TextInput
          name="liveDemo"
          label="Live Demo URL (Optional)"
          type="url"
          placeholder="https://myapp.vercel.app"
        />
        <Textarea
          name="description"
          label="Description"
          placeholder="Briefly describe your approach and key features."
          rows={5}
          required
        />
        <FileInput
          name="file"
          label="Submission File (Optional)"
          helperText="You can upload a .zip of your source code or other relevant files."
        />
        <button
          type="submit"
          className="btn btn-primary w-full mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Submit for Review"
          )}
        </button>
      </form>
    </FormProvider>
  );
};

export default SubmissionForm;
