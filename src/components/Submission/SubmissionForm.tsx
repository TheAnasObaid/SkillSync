"use client";

import { useSubmitSolutionMutation } from "@/hooks/mutations/useSubmissionMutations";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FileInput, TextInput, Textarea } from "../Forms/FormFields";

interface SubmissionFormData {
  githubRepo: string;
  liveDemo?: string;
  description: string;
  file?: FileList;
}

interface Props {
  challengeId: string;
  onSuccess: () => void;
}

const SubmissionForm = ({ challengeId, onSuccess }: Props) => {
  const { mutate: submit, isPending: isSubmitting } =
    useSubmitSolutionMutation();
  const formMethods = useForm<SubmissionFormData>();

  const onSubmit: SubmitHandler<SubmissionFormData> = (data) => {
    const formData = new FormData();
    formData.append("githubRepo", data.githubRepo);
    formData.append("description", data.description);
    if (data.liveDemo) formData.append("liveDemo", data.liveDemo);
    if (data.file && data.file.length > 0) {
      formData.append("file", data.file[0]);
    }

    submit(
      { challengeId, formData },
      {
        onSuccess: () => {
          formMethods.reset();
          onSuccess();
        },
      }
    );
  };

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className="grid gap-4"
      >
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
          placeholder="Briefly describe your approach..."
          rows={5}
          required
        />
        <FileInput
          name="file"
          label="Submission File (Optional)"
          helperText="Upload a .zip or other relevant files."
        />
        <button
          type="submit"
          className="btn btn-primary w-full mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="loading loading-spinner" />
          ) : (
            "Submit for Review"
          )}
        </button>
      </form>
    </FormProvider>
  );
};

export default SubmissionForm;
