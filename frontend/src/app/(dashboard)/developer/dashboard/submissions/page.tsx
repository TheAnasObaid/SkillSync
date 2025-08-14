import DeveloperSubmissionList from "@/components/Developer/DeveloperSubmissionList";
import { Suspense } from "react";

const SubmissionsPage = () => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">My Submissions</h1>
      <Suspense fallback={<SubmissionListSkeleton />}>
        <DeveloperSubmissionList />
      </Suspense>
    </>
  );
};

const SubmissionListSkeleton = () => (
  <div className="space-y-4">
    <div className="skeleton h-32 w-full rounded-lg"></div>
    <div className="skeleton h-32 w-full rounded-lg"></div>
    <div className="skeleton h-32 w-full rounded-lg"></div>
  </div>
);

export default SubmissionsPage;
