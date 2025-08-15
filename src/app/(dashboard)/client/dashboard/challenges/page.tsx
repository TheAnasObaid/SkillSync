import ClientChallengeList from "@/components/Challenge/ClientChallengeList";
import { Suspense } from "react";

const ClientChallengesPage = () => {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">My Challenges</h1>
      <Suspense fallback={<ChallengeListSkeleton />}>
        <ClientChallengeList />
      </Suspense>
    </div>
  );
};

const ChallengeListSkeleton = () => (
  <div className="space-y-4">
    <div className="skeleton h-24 w-full rounded-lg"></div>
    <div className="skeleton h-24 w-full rounded-lg"></div>
    <div className="skeleton h-24 w-full rounded-lg"></div>
  </div>
);

export default ClientChallengesPage;
