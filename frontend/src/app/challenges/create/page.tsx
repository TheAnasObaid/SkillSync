import ChallengeForm from "@/components/Challenge/ChallengeForm";

const NewChallenge = () => {
  return (
    <div className="space-y-4 max-w-md w-1/2 mt-10 mx-auto">
      <h2 className="text-4xl font-bold">New Challenge</h2>
      <ChallengeForm />
    </div>
  );
};

export default NewChallenge;
