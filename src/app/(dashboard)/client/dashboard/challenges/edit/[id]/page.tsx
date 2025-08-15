import ChallengeForm from "@/components/Challenge/ChallengeForm";
import { getChallengeById } from "@/lib/data/challenges";
import { IChallenge } from "@/types";
import { Suspense } from "react";

interface EditChallengePageProps {
  params: Promise<{ id: string }>;
}

const EditChallengePage = async ({ params }: EditChallengePageProps) => {
  const { id } = await params;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Edit Challenge</h2>

      <Suspense fallback={<ChallengeFormSkeleton />}>
        <EditChallengeDataLoader challengeId={id} />
      </Suspense>
    </div>
  );
};

const EditChallengeDataLoader = async ({
  challengeId,
}: {
  challengeId: string;
}) => {
  const challenge = await getChallengeById(challengeId);

  if (!challenge) {
    return <div className="alert alert-error">Challenge not found.</div>;
  }

  return (
    <ChallengeForm
      isEditing={true}
      existingChallenge={challenge as IChallenge}
    />
  );
};

const ChallengeFormSkeleton = () => (
  <div className="space-y-6">
    <div className="skeleton h-12 w-1/2"></div>
    <div className="skeleton h-12 w-full"></div>
    <div className="skeleton h-24 w-full"></div>
    <div className="skeleton h-12 w-full"></div>
    <div className="skeleton h-12 w-full mt-8"></div>
  </div>
);

export default EditChallengePage;
