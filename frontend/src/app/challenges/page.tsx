import ChallengeList from "@/components/Challenge/ChallengeList";

const Challenges = () => {
  return (
    <div className="grid gap-5 max-w-screen-md mx-auto w-full">
      <h2 className="text-4xl font-semibold">Challenges</h2>
      <ChallengeList />
    </div>
  );
};

export default Challenges;
