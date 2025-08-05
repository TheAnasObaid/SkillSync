import { getChallengeById } from "@/services/server/challengeService";

interface Props {
  params: Promise<{ id: string; submissionId: string }>;
}

const SubmissionDetailsPage = async ({ params }: Props) => {
  const { id, submissionId } = await params;
  const challenge = await getChallengeById(id);

  if (!challenge) {
    return <div className="text-center py-10">Challenge not found.</div>;
  }

  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold">Submission Details</h1>
      <p className="mt-4 text-base-content/70">
        You are viewing submission <strong>{submissionId}</strong> for the
        challenge "{challenge.title}".
      </p>
    </div>
  );
};

export default SubmissionDetailsPage;
