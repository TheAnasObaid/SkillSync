import ChallengeDetailsClient from "@/components/Challenge/ChallengeDetailsClient";
import { getChallengeById } from "@/services/server/challengeService";
import { IChallenge } from "@/types";

interface Props {
  params: { id: string };
}

// MAKE THE COMPONENT ASYNC
const ChallengeDetailsPage = async ({ params }: Props) => {
  const { id } = params;
  let challenge: IChallenge | null = null;
  let error: string | null = null;

  // Fetch data on the server
  try {
    challenge = await getChallengeById(id);
    if (!challenge) {
      error = "Challenge not found.";
    }
  } catch (err) {
    console.error(`Failed to fetch challenge ${id}:`, err);
    error = "Failed to load challenge details.";
  }

  // Handle the error state
  if (error || !challenge) {
    return (
      <div className="alert alert-error max-w-xl mx-auto my-10">
        <p>{error || "An unexpected error occurred."}</p>
      </div>
    );
  }

  // On success, render the Client Component and pass the data to it
  return <ChallengeDetailsClient challenge={challenge} />;
};

export default ChallengeDetailsPage;
