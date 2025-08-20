import { Suspense } from "react";
import ReviewSubmissionsClient from "@/components/Submission/ReviewSubmissionsClients";
import { getChallengeById } from "@/lib/data/challenges";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

const ReviewSubmissionsPage = async ({ params }: Props) => {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/login?callbackUrl=/client/dashboard/challenges/review/${id}`);
  }

  const challenge = await getChallengeById(id);

  if (!challenge) {
    notFound();
  }

  if (challenge.createdById !== session.user.id) {
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
        <ReviewSubmissionsClient initialChallenge={challenge} />
      </Suspense>
    </div>
  );
};

export default ReviewSubmissionsPage;
