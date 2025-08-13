import ChallengeList from "@/components/Challenge/ChallengeList";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const ChallengesPage = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Open Challenges</h1>
        <p className="text-lg text-base-content/70 mt-2">
          Find your next project and showcase your skills.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="text-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        }
      >
        <ChallengeList />
      </Suspense>
    </div>
  );
};

export default ChallengesPage;
