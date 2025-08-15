import ReviewSubmissionsClient from "@/components/Submission/ReviewSubmissionsClients";
import { getChallengeById } from "@/lib/data/challenges";
import { IChallenge } from "@/types";
import { Suspense } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

const ReviewSubmissionsPage = async ({ params }: Props) => {
  const { id } = await params;
  const challenge = await getChallengeById(id);

  if (!challenge) {
    return <div className="alert alert-error">Challenge not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">{challenge.title}</h1>
        <p className="text-base-content/70 mt-1">
          Review all submitted solutions.
        </p>
      </div>

      <Suspense fallback={<div className="skeleton h-64 w-full"></div>}>
        <ReviewSubmissionsClient initialChallenge={challenge as IChallenge} />
      </Suspense>
    </div>
  );
};

export default ReviewSubmissionsPage;
