import ChallengeList from "@/components/Challenge/ChallengeList";

const Challenges = () => {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto]">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-10">
          Open Challenges
        </h1>
        <ChallengeList />
      </main>
    </div>
  );
};

export default Challenges;
