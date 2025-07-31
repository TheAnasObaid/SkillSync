import ChallengeForm from "@/components/Challenge/ChallengeForm";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { clientSidebarLinks } from "@/config/dashboard";
import { getChallengeById } from "@/services/server/challengeService";
import { IChallenge } from "@/types";

interface EditChallengePageProps {
  params: { id: string };
}

const EditChallengePage = async ({ params }: EditChallengePageProps) => {
  const { id } = params;
  const challenge = await getChallengeById(id);

  if (!challenge) {
    return (
      <DashboardLayout sidebarLinks={clientSidebarLinks}>
        <div className="alert alert-error">Challenge not found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarLinks={clientSidebarLinks}>
      <div>
        <h2 className="text-3xl font-bold mb-6">Edit Challenge</h2>
        <ChallengeForm
          isEditing={true}
          existingChallenge={challenge as IChallenge}
        />
      </div>
    </DashboardLayout>
  );
};

export default EditChallengePage;
