import { ISubmission } from "@/types";
import { FiInbox } from "react-icons/fi";
import SubmissionCard from "./SubmissionCard";

interface Props {
  submissions: (ISubmission & { isNew?: boolean })[];
  isLoading: boolean;
}

const PublicSubmissionList = ({ submissions, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center p-12 bg-base-200/50 border border-base-300 rounded-lg">
        <FiInbox className="mx-auto text-5xl text-base-content/40 mb-4" />
        <h3 className="text-2xl font-bold">No Submissions Yet</h3>
        <p className="text-base-content/70 mt-2">
          Be the first to submit a solution for this challenge!
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {submissions.map((sub) => (
        <SubmissionCard key={sub._id} submission={sub} />
      ))}
    </div>
  );
};

export default PublicSubmissionList;
