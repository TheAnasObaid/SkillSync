import { ISubmission } from "@/types";

interface Props {
  submissions: ISubmission[];
}

const AdminSubmissionList = ({ submissions }: Props) => {
  if (submissions.length === 0) {
    return <p>No submissions found on the platform yet.</p>;
  }

  return (
    <div className="card bg-base-200/50 border border-base-300">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Developer</th>
              <th>Challenge</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub._id} className="hover">
                <td>
                  {typeof sub.developerId === "object" && (
                    <>
                      <div className="font-bold">
                        {sub.developerId.profile.firstName}
                      </div>
                      <div className="text-sm opacity-50">
                        {sub.developerId.email}
                      </div>
                    </>
                  )}
                </td>
                <td>
                  {typeof sub.challengeId === "object"
                    ? sub.challengeId.title
                    : "N/A"}
                </td>
                <td>
                  <span className="badge badge-ghost badge-sm">
                    {sub.status}
                  </span>
                </td>
                <td>{new Date(sub.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSubmissionList;
