import ChallengeList from "@/components/Challenge/ChallengeList";
import PageTitle from "@/components/Common/PageTitle";
import { Suspense } from "react";
import { FiArchive } from "react-icons/fi";

const ChallengesPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <PageTitle
        icon={<FiArchive size={40} />}
        title="Open Challenges"
        subtitle="Find your next project and showcase your skills."
      />
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-8">
            <div className="skeleton h-80 w-full"></div>
            <div className="skeleton h-80 w-full"></div>
          </div>
        }
      >
        <ChallengeList />
      </Suspense>
    </div>
  );
};

export default ChallengesPage;
