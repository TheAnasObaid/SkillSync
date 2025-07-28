import { User } from "@/store/authStore";
import { FiAward, FiMail } from "react-icons/fi";
import UserAvatar from "./UserAvatar";

interface ProfileViewProps {
  user: User | null;
}

const ProfileView = ({ user }: ProfileViewProps) => {
  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="card bg-base-200/50 border border-base-300 p-8 flex flex-col md:flex-row items-center gap-6">
        <UserAvatar
          name={user.profile?.firstName}
          className="w-24 h-24 text-4xl"
        />
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold">
            {user.profile?.firstName} {user.profile?.lastName}
          </h2>
          <p className="text-base-content/70 flex items-center justify-center md:justify-start gap-2 mt-1">
            <FiMail /> {user.email}
          </p>
        </div>
      </div>

      {user.profile?.bio && (
        <div className="card bg-base-200/50 border border-base-300 p-8">
          <h3 className="font-bold text-xl mb-4">About Me</h3>
          <p className="text-base-content/80 whitespace-pre-line">
            {user.profile.bio}
          </p>
        </div>
      )}

      {user.profile?.skills && user.profile.skills.length > 0 && (
        <div className="card bg-base-200/50 border border-base-300 p-8">
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
            <FiAward /> Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.profile.skills.map((skill: string) => (
              <div key={skill} className="badge badge-primary badge-soft">
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
