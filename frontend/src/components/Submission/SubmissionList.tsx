interface Submission {
  _id: string;
  content: string;
  developerId: {
    _id: string;
    profile: {
      firstName: string;
    };
    email: string;
  };
  files: Object[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

const SubmissionList = async ({ id }: { id: string }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/submissions/challenge/${id}`
  );
  const submissions: Submission[] = await response.json();
  console.log(submissions);
  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <div key={submission._id} className="card shadow-md p-4 bg-base-100">
          <p>
            <strong>Submitted by: </strong>
            {submission.developerId.profile.firstName}
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
};

export default SubmissionList;
