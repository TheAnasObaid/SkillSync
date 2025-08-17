import Image from "next/image";

const avatarColors = [
  "bg-secondary/20 text-secondary-content",
  "bg-primary/20 text-primary",
  "bg-accent/20 text-accent",
  "bg-info/20 text-info",
  "bg-success/20 text-success",
  "bg-warning/20 text-warning",
  "bg-error/20 text-error",
];

interface Props {
  name?: string | null;
  avatarUrl?: string | null;
  className?: string;
}

const UserAvatar = ({ name, avatarUrl, className = "w-10 h-10" }: Props) => {
  if (avatarUrl) {
    return (
      <div className={`avatar ${className}`}>
        <div className="w-full h-full rounded-full relative overflow-hidden">
          <Image
            src={avatarUrl}
            alt={name || "User Avatar"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
    );
  }

  const getInitials = (nameStr?: string | null): string => {
    if (!nameStr) return "?";
    const parts = nameStr.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "?";
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : parts[0].substring(0, 2).toUpperCase();
  };

  const initials = getInitials(name);
  const charCodeSum =
    (initials.charCodeAt(0) || 0) + (initials.charCodeAt(1) || 0);
  const colorIndex = charCodeSum % avatarColors.length;
  const colorClasses = avatarColors[colorIndex];

  return (
    <div className={`avatar placeholder ${className}`}>
      <div
        className={`w-full h-full rounded-full bg-base-content/10 text-base-content flex items-center justify-center ${colorClasses}`}
      >
        <span className="font-bold">{initials}</span>
      </div>
    </div>
  );
};

export default UserAvatar;
