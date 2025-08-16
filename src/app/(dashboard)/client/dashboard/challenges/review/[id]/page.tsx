import { Suspense } from "react";
import ReviewSubmissionsClient from "@/components/Submission/ReviewSubmissionsClients";
import { getChallengeById } from "@/lib/data/challenges";
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { IChallenge } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

const ReviewSubmissionsPage = async ({ params }: Props) => {
  const { id } = await params;
  const session = await getSession();

  const challenge = await getChallengeById(id);

  if (!session?.user) {
    redirect("/login");
  }

  if (!challenge) {
    notFound();
  }

  if (
    typeof challenge.createdBy !== "string" &&
    challenge.createdBy._id !== session.user._id
  ) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto">
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
