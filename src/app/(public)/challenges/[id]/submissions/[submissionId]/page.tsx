import SubmissionDetailsClient from "@/components/Submission/SubmissionDetailsClient ";
import { getSubmissionDetails } from "@/lib/data/submissions";
import { IChallenge, ISubmission, IUser } from "@/types";
import { Suspense } from "react";

interface Props {
  params: Promise<{ submissionId: string }>;
}

const SubmissionDetailsPage = async ({ params }: Props) => {
  const { submissionId } = await params;

  return (
    <Suspense fallback={<SubmissionSkeleton />}>
      <SubmissionDataLoader submissionId={submissionId} />
    </Suspense>
  );
};

const SubmissionDataLoader = async ({
  submissionId,
}: {
  submissionId: string;
}) => {
  const submission = await getSubmissionDetails(submissionId);

  if (!submission) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">Submission Not Found</h1>
        <p className="text-base-content/70 mt-2">
          The submission you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

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

const SubmissionSkeleton = () => (
  <div className="max-w-6xl mx-auto py-12 px-4 animate-pulse">
    <div className="skeleton h-8 w-1/2 mb-4"></div>
    <div className="skeleton h-12 w-3/4 mb-6"></div>
    <div className="divider"></div>
    <div className="grid lg:grid-cols-[1fr_320px] gap-12 mt-8">
      <div className="space-y-8">
        <div className="skeleton h-48 w-full"></div>
        <div className="skeleton h-32 w-full"></div>
      </div>
      <div className="space-y-6">
        <div className="skeleton h-64 w-full"></div>
      </div>
    </div>
  </div>
);

export default SubmissionDetailsPage;
