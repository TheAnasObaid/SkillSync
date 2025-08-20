import SubmissionDetailsClient from "@/components/Submission/SubmissionDetailsClient ";
import { getSubmissionDetails } from "@/lib/data/submissions";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface Props {
  params: Promise<{ submissionId: string }>;
}

const submissionWithDetails = Prisma.validator<Prisma.SubmissionDefaultArgs>()({
  include: {
    developer: true,
    challenge: true,
  },
});
type SubmissionWithDetails = Prisma.SubmissionGetPayload<
  typeof submissionWithDetails
>;

const SubmissionDataLoader = async ({
  submissionId,
}: {
  submissionId: string;
}) => {
  const submission = await getSubmissionDetails(submissionId);

  if (!submission) {
    notFound();
  }

  return (
    <SubmissionDetailsClient submission={submission as SubmissionWithDetails} />
  );
};

const SubmissionDetailsPage = async ({ params }: Props) => {
  const { submissionId } = await params;

  return (
    <Suspense fallback={<SubmissionSkeleton />}>
      <SubmissionDataLoader submissionId={submissionId} />
    </Suspense>
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
