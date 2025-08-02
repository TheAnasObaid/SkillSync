"use client";

import { useChallengeForm } from "@/hooks/useChallengeForm";
import { IChallenge } from "@/types";
import { FormProvider } from "react-hook-form";
import { FileInput, Select, TextInput, Textarea } from "../Forms/FormFields";

interface Props {
  isEditing?: boolean;
  existingChallenge?: IChallenge;
}

const FormSectionHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <div className="border-b border-base-300 pb-3">
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-base-content/70 text-sm mt-1">{subtitle}</p>
  </div>
);

const ChallengeForm = ({ isEditing = false, existingChallenge }: Props) => {
  const { form, isSubmitting, onSubmit } = useChallengeForm(
    isEditing,
    existingChallenge
  );
  const { handleSubmit } = form;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8">
        <section className="grid gap-6">
          <FormSectionHeader
            title="Core Details"
            subtitle="What is your challenge about?"
          />
          <TextInput
            name="title"
            label="Challenge Title"
            placeholder="e.g., Build a Real-time Chat App"
          />
          <Textarea
            name="description"
            label="Brief Description"
            rows={3}
            placeholder="Summarize the main goal..."
          />
          <Textarea
            name="requirements"
            label="Detailed Requirements"
            rows={6}
            placeholder="Use Markdown for lists, code blocks, etc."
            helperText="Markdown is supported for rich formatting."
          />
        </section>

        <section className="grid gap-4">
          <FormSectionHeader
            title="Metadata"
            subtitle="Help developers filter and find your challenge."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              name="category"
              label="Category"
              placeholder="e.g., Web Development"
            />
            <Select name="difficulty" label="Difficulty">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </Select>
          </div>
          <TextInput
            name="tags"
            label="Tags"
            helperText="Enter skills separated by commas."
            placeholder="react, nodejs, typescript"
          />
        </section>

        <section className="grid gap-4">
          <FormSectionHeader
            title="Rewards & Deadline"
            subtitle="Set the prize and timeline for your challenge."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              name="prize"
              label="Prize ($)"
              type="number"
              placeholder="e.g., 500"
            />
            <TextInput
              name="deadline"
              label="Submission Deadline"
              type="date"
            />
          </div>
        </section>

        <section className="grid gap-4">
          <FormSectionHeader
            title="Resources"
            subtitle="Attach any helpful files for the developers."
          />
          <FileInput
            name="file"
            label="Resource File (Optional)"
            helperText="Max file size: 10MB."
          />
        </section>

        <div className="border-t border-base-300 pt-6">
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner" />
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Publish Challenge"
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ChallengeForm;
