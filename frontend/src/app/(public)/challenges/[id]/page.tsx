import ChallengeDetailsClient from "@/components/Challenge/ChallengeDetailsClient";
import { getChallengeById } from "@/services/server/challengeService";
import { getPublicSubmissionsServer } from "@/services/server/submissionService";
import { IChallenge, ISubmission } from "@/types";

interface ChallengePageProps {
  params: { id: string };
}

const ChallengeDetailsPage = async ({ params }: ChallengePageProps) => {
  const { id } = params;

  let initialChallenge: IChallenge | null = null;
  let initialSubmissions: ISubmission[] = [];
  let error: string | null = null;

  try {
    const [challengeData, submissionsData] = await Promise.all([
      getChallengeById(id),
      getPublicSubmissionsServer(id),
    ]);

    if (!challengeData) {
      error = "Challenge not found.";
    } else {
      initialChallenge = challengeData;
      initialSubmissions = submissionsData;
    }
  } catch (err) {
    console.error(`Failed to fetch data for challenge ${id}:`, err);
    error = "Failed to load challenge details.";
  }

  if (error || !initialChallenge) {
    return (
      <div className="alert alert-error max-w-xl mx-auto my-10">
        <p>{error || "An unexpected error occurred."}</p>
      </div>
    );
  }

  return (
    <ChallengeDetailsClient
      initialChallenge={initialChallenge}
      initialSubmissions={initialSubmissions}
    />
  );
};

export default ChallengeDetailsPage;
