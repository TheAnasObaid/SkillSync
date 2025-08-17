"use client";

import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  challengeFormSchema,
  ChallengeFormValues,
  challengeApiSchema,
} from "@/lib/validationSchemas";
import {
  useCreateChallengeMutation,
  useUpdateChallengeMutation,
} from "@/hooks/mutations/useChallengeMutations";
import { FileInput, Select, TextInput, Textarea } from "../Forms/FormFields";
import { Challenge, ChallengeDifficulty } from "@prisma/client";

interface Props {
  isEditing?: boolean;
  existingChallenge?: Challenge;
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
  const { mutate: createMutate, isPending: isCreating } =
    useCreateChallengeMutation();
  const { mutate: updateMutate, isPending: isUpdating } =
    useUpdateChallengeMutation();
  const isSubmitting = isCreating || isUpdating;

  const formMethods = useForm<ChallengeFormValues>({
    resolver: zodResolver(challengeFormSchema),
    defaultValues:
      isEditing && existingChallenge
        ? {
            title: existingChallenge.title || "",
            description: existingChallenge.description || "",
            requirements: existingChallenge.requirements || "",
            category: existingChallenge.category || "",
            difficulty:
              existingChallenge.difficulty || ChallengeDifficulty.BEGINNER,
            deadline: new Date(existingChallenge.deadline)
              .toISOString()
              .split("T")[0],
            prize: existingChallenge.prize?.toString() || "0",
            tags: (existingChallenge.tags || []).join(", "),
          }
        : { difficulty: ChallengeDifficulty.BEGINNER },
  });

  const onSubmit: SubmitHandler<ChallengeFormValues> = (data) => {
    // Transform data for the API using our Zod schema
    const transformedData = challengeApiSchema.parse(data);

    const formData = new FormData();
    // Use Object.entries to correctly handle all validated data
    Object.entries(transformedData).forEach(([key, value]) => {
      // Prisma expects arrays to be sent one by one
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, item));
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, String(value));
      }
    });

    // Append file if it exists
    if (data.file && data.file.length > 0) {
      formData.append("file", data.file[0]);
    }

    if (isEditing && existingChallenge) {
      updateMutate({ id: existingChallenge.id, formData });
    } else {
      createMutate(formData);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className="card bg-base-200/50 border border-base-300 shadow-lg"
      >
        <div className="card-body p-8 grid gap-8">
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
              placeholder="Use Markdown..."
              helperText="Markdown is supported."
            />
          </section>

          <section className="grid gap-4">
            <FormSectionHeader
              title="Metadata"
              subtitle="Help developers find your challenge."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                name="category"
                label="Category"
                placeholder="e.g., Web Development"
              />
              <Select name="difficulty" label="Difficulty">
                <option value={ChallengeDifficulty.BEGINNER}>Beginner</option>
                <option value={ChallengeDifficulty.INTERMEDIATE}>
                  Intermediate
                </option>
                <option value={ChallengeDifficulty.ADVANCED}>Advanced</option>
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
              subtitle="Set the prize and timeline."
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
              subtitle="Attach any helpful files."
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
        </div>
      </form>
    </FormProvider>
  );
};

export default ChallengeForm;
