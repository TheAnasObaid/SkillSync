const avatarColors = [
  "bg-primary/20 text-primary",
  "bg-secondary/20 text-secondary-content",
  "bg-accent/20 text-accent",
  "bg-info/20 text-info",
  "bg-success/20 text-success",
  "bg-warning/20 text-warning-content",
  "bg-error/20 text-error",
];

interface Props {
  name?: string;
  avatarUrl?: string | null;
  className?: string;
}

const UserAvatar = ({ name, avatarUrl, className = "w-10 h-10" }: Props) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  if (avatarUrl) {
    return (
      <div className={`avatar ${className}`}>
        <div className="w-full h-full rounded-full relative overflow-hidden">
          <img
            src={`${API_BASE_URL}/${avatarUrl.replace(/\\/g, "/")}`}
            alt={name || "User Avatar"}
            className="object-cover"
          />
        </div>
      </div>
    );
  }

  // Fallback logic for initials (this is already correct)
  const getInitials = (nameStr?: string): string => {
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
    <div className={`placeholder ${className}`}>
      <div
        className={`w-full h-full rounded-full bg-base-content/10 text-base-content flex items-center justify-center ${colorClasses}`}
      >
        {initials}
      </div>
    </div>
  );
};

export default UserAvatar;
