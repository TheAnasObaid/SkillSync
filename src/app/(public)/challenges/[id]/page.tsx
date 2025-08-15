import ChallengeDetailsClient from "@/components/Challenge/ChallengeDetailsClient";
import { getChallengeById } from "@/lib/data/challenges";
import { getPublicSubmissionsForChallenge } from "@/lib/data/submissions";
import { IChallenge, ISubmission } from "@/types";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ChallengeDetailsPage({ params }: Props) {
  const { id } = await params;
  const [challenge, submissions] = await Promise.all([
    getChallengeById(id),
    getPublicSubmissionsForChallenge(id), // This function now exists and works.
  ]);
  if (!challenge) {
    notFound();
  }
  return (
    <ChallengeDetailsClient
      initialChallenge={challenge as IChallenge}
      initialSubmissions={submissions as ISubmission[]}
    />
  );
}
