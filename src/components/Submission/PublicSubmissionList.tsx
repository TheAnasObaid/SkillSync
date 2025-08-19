"use client";

import { FiInbox } from "react-icons/fi";
import SubmissionCard from "./SubmissionCard";
import { Prisma } from "@prisma/client";

//    Define the exact data shape for a submission that this component needs.
//    This includes the nested 'developer' object with the fields we selected.
const submissionWithDeveloper =
  Prisma.validator<Prisma.SubmissionDefaultArgs>()({
    include: {
      developer: {
        select: {
          id: true,
          firstName: true,
          image: true,
        },
      },
    },
  });

type SubmissionWithDeveloper = Prisma.SubmissionGetPayload<
  typeof submissionWithDeveloper
>;

interface Props {
  submissions: SubmissionWithDeveloper[];
}

const PublicSubmissionList = ({ submissions }: Props) => {
  if (submissions.length === 0) {
    return (
      <div className="text-center p-12 bg-base-200/50 border border-base-300 rounded-lg">
        <FiInbox className="mx-auto text-5xl text-base-content/40 mb-4" />
        <h3 className="text-2xl font-bold">No Public Submissions</h3>
        <p className="text-base-content/70 mt-2">
          Submissions for this challenge are not publicly visible yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {submissions.map((sub) => (
        <SubmissionCard key={sub.id} submission={sub} />
      ))}
    </div>
  );
};

export default PublicSubmissionList;
