import {
  FiAward,
  FiBriefcase,
  FiCamera,
  FiMail,
  FiShield,
  FiStar,
} from "react-icons/fi";
import UserAvatar from "./UserAvatar";
import { IUser } from "@/types";

interface Props {
  user: IUser | null;
  onAvatarClick?: () => void;
}

const ProfileView = ({ user, onAvatarClick }: Props) => {
  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="card bg-base-200/50 border border-base-300 shadow-md transition-all hover:border-primary/50">
        <div className="card-body p-8 flex flex-col md:flex-row items-center gap-6">
          <div
            className={
              onAvatarClick
                ? "relative group cursor-pointer"
                : "relative group cursor-default"
            }
            onClick={onAvatarClick}
          >
            <UserAvatar
              name={user.profile?.firstName}
              avatarUrl={user.profile?.avatar}
              className="w-24 h-24 text-4xl"
            />

            {onAvatarClick && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FiCamera className="text-white text-2xl" />
              </div>
            )}
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold">
              {user.profile?.firstName} {user.profile?.lastName}
            </h2>

            {user.role === "developer" && user.profile?.experience && (
              <p className="text-info flex items-center justify-center md:justify-start gap-2 mt-1">
                <FiStar /> {user.profile.experience}
              </p>
            )}

            {user.role === "client" && user.profile?.companyName && (
              <p className="text-primary flex items-center justify-center md:justify-start gap-2 mt-1">
                <FiBriefcase /> {user.profile.companyName}
              </p>
            )}
            {user.role === "admin" && (
              <p className="text-error flex items-center justify-center md:justify-start gap-2 mt-1">
                <FiShield /> Platform Administrator
              </p>
            )}
            <p className="text-base-content/70 flex items-center justify-center md:justify-start gap-2 mt-1">
              <FiMail /> {user.email}
            </p>
          </div>
        </div>
      </div>

      {user.profile?.bio && (
        <div className="card bg-base-200/50 border border-base-300 shadow-md transition-all hover:border-primary/50">
          <div className="card-body p-8">
            <h3 className="font-bold text-xl mb-4">About Me</h3>
            <p className="text-base-content/80 whitespace-pre-line">
              {user.profile.bio}
            </p>
          </div>
        </div>
      )}

      {user.profile?.skills && user.profile.skills.length > 0 && (
        <div className="card bg-base-200/50 border border-base-300 shadow-md transition-all hover:border-primary/50">
          <div className="card-body p-8">
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
        </div>
      )}
    </div>
  );
};

export default ProfileView;
