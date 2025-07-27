import ChallengeList from "@/components/Challenge/ChallengeList";

const Challenges = () => {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto]">
      <div className="grid gap-5 max-w-screen-md mx-auto w-full">
        <h2 className="text-4xl font-semibold">Challenges</h2>
        <ChallengeList />
      </div>
    </div>
  );
};

export default Challenges;
