import ReviewSubmissionsClient from "@/components/Submission/ReviewSubmissionsClients";
import { getChallengeById } from "@/services/server/challengeService";
import { getSubmissionsForReview } from "@/services/server/submissionService";

interface Props {
  params: Promise<{ id: string }>;
}

const ReviewSubmissionsPage = async ({ params }: Props) => {
  const { id } = await params;

  const [challenge, submissions] = await Promise.all([
    getChallengeById(id),
    getSubmissionsForReview(id),
  ]);

  if (!challenge) {
    return <div className="alert alert-error">Challenge not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <ReviewSubmissionsClient
        initialChallenge={challenge}
        initialSubmissions={submissions}
      />
    </div>
  );
};

export default ReviewSubmissionsPage;
