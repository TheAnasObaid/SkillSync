import { ISubmission } from "@/types";

const SubmissionList = async ({ id }: { id: string }) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/submissions/challenge/${id}`
    );
    const submissions: ISubmission[] = await response.json();

    return (
      <div className="space-y-4">
        {submissions.map((submission) => (
          <div key={submission._id} className="card shadow-md p-4 bg-base-100">
            <p>
              <strong>Submitted by: </strong>
              {typeof submission.developerId !== "string" &&
                submission.developerId.profile.firstName}
            </p>
            <p>
              <strong>Description:</strong> {submission.content}
            </p>
            <a href={"#"} target="_blank" className="link link-primary">
              View Code
            </a>
            <p className="text-sm text-gray-500">
              Submitted on: {new Date(submission.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    return <p className="text-error px-3">Something failed.</p>;
  }
};

export default SubmissionList;
