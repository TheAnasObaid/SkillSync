import SubmissionList from "@/components/Submission/SubmissionList";
import React from "react";

const SubmissionsPage = () => {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto]">
      <div className="max-w-4xl w-full mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Challenge Submissions</h1>
        <SubmissionList id="6885c1c092dc9243afdbe2fa" />
      </div>
    </div>
  );
};

export default SubmissionsPage;
