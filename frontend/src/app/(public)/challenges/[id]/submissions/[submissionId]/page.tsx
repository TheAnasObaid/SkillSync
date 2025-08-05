// ===== File: frontend\src\app\(public)\challenges\[id]\submissions\[submissionId]\page.tsx =====
import SubmissionDetailsClient from "@/components/Submission/SubmissionDetailsClient ";
import { getSubmissionDetails } from "@/services/server/submissionService";
import { IChallenge, ISubmission, IUser } from "@/types";

interface Props {
  params: Promise<{ id: string; submissionId: string }>;
}

const SubmissionDetailsPage = async ({ params }: Props) => {
  const { submissionId } = await params;
  const submission = await getSubmissionDetails(submissionId);

  if (!submission) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">Submission Not Found</h1>
        <p className="text-base-content/70 mt-2">
          The submission you are looking for does not exist or could not be
          loaded.
        </p>
      </div>
    );
  }

  // FIX: Removed the `as any` type assertion. The types now match perfectly.
  return (
    <SubmissionDetailsClient
      submission={
        submission as ISubmission & {
          developerId: IUser;
          challengeId: IChallenge;
        }
      }
    />
  );
};

export default SubmissionDetailsPage;
