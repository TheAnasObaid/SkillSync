"use client";

const avatarColors = [
  "bg-primary/20 text-primary",
  "bg-secondary/20 text-secondary-content",
  "bg-accent/20 text-accent",
  "bg-info/20 text-info",
  "bg-success/20 text-success",
  "bg-warning/20 text-warning-content",
  "bg-error/20 text-error",
];

interface UserAvatarProps {
  name?: string;
  className?: string;
}

const UserAvatar = ({ name, className = "w-10 h-10" }: UserAvatarProps) => {
  const getInitials = (nameStr?: string): string => {
    if (!nameStr) {
      return "?";
    }

    const parts = nameStr.trim().split(" ").filter(Boolean);

    if (parts.length === 0) {
      return "?";
    }

    if (parts.length > 1) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }

    return parts[0].substring(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  const charCodeSum =
    (initials.charCodeAt(0) || 0) + (initials.charCodeAt(1) || 0);
  const colorIndex = charCodeSum % avatarColors.length;
  const colorClasses = avatarColors[colorIndex];

  return (
    <div>
      <div
        className={`rounded-full w-12 h-12 flex items-center justify-center text-base-content bg-base-content/10 avatar placeholder ${colorClasses} ${className}`}
      >
        <span>{initials}</span>
      </div>
    </div>
  );
};

export default UserAvatar;
