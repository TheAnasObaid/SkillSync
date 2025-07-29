import ChallengeList from "@/components/Challenge/ChallengeList";

const Challenges = () => {
  return (
    <div className="h-screen grid max-w-5xl py-5 w-full mx-auto grid-rows-[auto_1fr_auto]">
      <div className="grid gap-5">
        <h1 className="text-3xl text-center font-bold">Open Challenges</h1>
        <ChallengeList />
      </div>
    </div>
  );
};

export default Challenges;
