import { Role } from "@prisma/client";
import {
  FiAward,
  FiBriefcase,
  FiCamera,
  FiMail,
  FiShield,
  FiStar,
} from "react-icons/fi";
import UserAvatar from "./UserAvatar";

interface Props {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email?: string;
    image: string | null;
    role: Role;
    experience: string | null;
    companyName: string | null;
    bio: string | null;
    skills: string[];
  } | null;
  onAvatarClick?: () => void;
}

const ProfileView = ({ user, onAvatarClick }: Props) => {
  if (!user) {
    return <div className="skeleton h-48 w-full"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="card bg-base-200/50 border border-base-300 shadow-md">
        <div className="card-body p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div
            className={
              onAvatarClick ? "relative group cursor-pointer" : "relative group"
            }
            onClick={onAvatarClick}
          >
            <UserAvatar
              name={user.firstName}
              image={user.image}
              className="w-24 h-24 text-4xl"
            />
            {onAvatarClick && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FiCamera className="text-white text-2xl" />
              </div>
            )}
          </div>

          <div>
            <h2 className="text-3xl font-bold">
              {user.firstName} {user.lastName}
            </h2>

            {user.role === "DEVELOPER" && user.experience && (
              <p className="text-info flex items-center justify-center md:justify-start gap-2 mt-1">
                <FiStar /> {user.experience}
              </p>
            )}
            {user.role === "CLIENT" && user.companyName && (
              <p className="text-primary flex items-center justify-center md:justify-start gap-2 mt-1">
                <FiBriefcase /> {user.companyName}
              </p>
            )}
            {user.role === "ADMIN" && (
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

      {user.bio && (
        <div className="card bg-base-200/50 border border-base-300">
          <div className="card-body p-8">
            <h3 className="font-bold text-xl mb-4">About Me</h3>
            <p className="text-base-content/80 whitespace-pre-line">
              {user.bio}
            </p>
          </div>
        </div>
      )}

      {user.skills && user.skills.length > 0 && (
        <div className="card bg-base-200/50 border border-base-300">
          <div className="card-body p-8">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <FiAward /> Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill: string) => (
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
