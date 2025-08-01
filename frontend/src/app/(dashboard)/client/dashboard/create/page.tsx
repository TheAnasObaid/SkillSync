import ChallengeForm from "@/components/Challenge/ChallengeForm";

const CreateChallengePage = () => {
  return (
    <div className="grid gap-6">
      <h2 className="text-3xl font-bold">Create a New Challenge</h2>
      <ChallengeForm />
    </div>
  );
};

export default CreateChallengePage;
