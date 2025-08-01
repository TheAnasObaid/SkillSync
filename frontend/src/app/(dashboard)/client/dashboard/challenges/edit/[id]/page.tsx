import ChallengeForm from "@/components/Challenge/ChallengeForm";
import { getChallengeById } from "@/services/server/challengeService";
import { IChallenge } from "@/types";

interface EditChallengePageProps {
  params: Promise<{ id: string }>;
}

const EditChallengePage = async ({ params }: EditChallengePageProps) => {
  const { id } = await params;
  const challenge = await getChallengeById(id);

  if (!challenge) {
    return <div className="alert alert-error">Challenge not found.</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Edit Challenge</h2>
      <ChallengeForm
        isEditing={true}
        existingChallenge={challenge as IChallenge}
      />
    </div>
  );
};

export default EditChallengePage;
