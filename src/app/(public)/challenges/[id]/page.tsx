import ChallengeDetailsClient from "@/components/Challenge/ChallengeDetailsClient";
import { getChallengeById } from "@/lib/data/challenges";
import { getPublicSubmissionsForChallenge } from "@/lib/data/submissions"; // We need to create this function
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

// Data Loader Component
const ChallengeDataLoader = async ({
  challengeId,
}: {
  challengeId: string;
}) => {
  const [challenge, submissions] = await Promise.all([
    getChallengeById(challengeId),
    getPublicSubmissionsForChallenge(challengeId),
  ]);

  if (!challenge) {
    notFound();
  }

  return (
    <ChallengeDetailsClient
      initialChallenge={challenge}
      initialSubmissions={submissions}
    />
  );
};

export default async function ChallengeDetailsPage({ params }: Props) {
  const { id } = await params;

  return (
    <Suspense fallback={<ChallengeDetailsSkeleton />}>
      <ChallengeDataLoader challengeId={id} />
    </Suspense>
  );
}

const ChallengeDetailsSkeleton = () => (
  <div className="animate-pulse">
    <div className="card bg-base-200/50">
      <div className="max-w-6xl w-full mx-auto px-4 py-8 space-y-4">
        <div className="skeleton h-10 w-1/3"></div>
        <div className="skeleton h-16 w-3/4"></div>
        <div className="divider"></div>
        <div className="flex gap-6">
          <div className="skeleton h-6 w-48"></div>
          <div className="skeleton h-6 w-48"></div>
        </div>
      </div>
    </div>
    <div className="max-w-6xl w-full mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-[1fr_350px] gap-12">
        <div className="skeleton h-96 w-full"></div>
        <div className="skeleton h-64 w-full"></div>
      </div>
    </div>
  </div>
);
