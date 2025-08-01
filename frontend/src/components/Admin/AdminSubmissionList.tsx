import { ISubmission } from "@/types";
import SubmissionInfoCard from "./SubmissionInfoCard";
import UserAvatar from "../Profile/UserAvatar";

interface Props {
  submissions: ISubmission[];
}

const statusStyles: { [key: string]: string } = {
  pending: "badge-info",
  reviewed: "badge-ghost",
  winner: "badge-success",
  rejected: "badge-error",
};

const AdminSubmissionList = ({ submissions }: Props) => {
  if (submissions.length === 0) {
    return (
      <p className="text-base-content/70">
        No submissions found on the platform yet.
      </p>
    );
  }

  return (
    <div>
      {/* --- MOBILE VIEW (Default) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {submissions.map((sub) => (
          <SubmissionInfoCard key={sub._id} submission={sub} />
        ))}
      </div>

      {/* --- DESKTOP TABLE VIEW --- */}
      <div className="hidden md:block card bg-base-200/50 border border-base-300 overflow-x-auto">
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
            {submissions.map((sub) => {
              const developer =
                typeof sub.developerId === "object" ? sub.developerId : null;
              const challenge =
                typeof sub.challengeId === "object" ? sub.challengeId : null;
              return (
                <tr key={sub._id} className="hover">
                  <td>
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        name={developer?.profile.firstName}
                        avatarUrl={developer?.profile.avatar}
                      />
                      <div>
                        <div className="font-bold">
                          {developer?.profile.firstName}
                        </div>
                        <div className="text-sm opacity-50">
                          {developer?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{challenge?.title || "N/A"}</td>
                  <td>
                    <span
                      className={`badge ${
                        statusStyles[sub.status] || "badge-ghost"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td>{new Date(sub.createdAt).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSubmissionList;
