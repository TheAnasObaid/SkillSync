import Link from "next/link";

interface Props {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  link?: string;
  linkText?: string;
  color?: "green" | "blue" | "orange" | "red";
}

const AdminStatCard = ({
  icon,
  label,
  value,
  link,
  linkText = "View all",
  color = "green",
}: Props) => {
  const colorClasses = {
    green: "text-primary border-primary/50",
    blue: "text-info border-info/50",
    orange: "text-warning border-warning/50",
    red: "text-error border-error/50",
  };

  return (
    // The base card style remains consistent with our application's theme.
    <div className="card bg-base-200/50 border border-base-300 shadow-md transition-all hover:shadow-lg">
      <div className="card-body p-6">
        <div className="flex justify-between items-start">
          {/* --- 3. IMPROVED VISUAL HIERARCHY --- */}
          {/* The label is now smaller and positioned at the top. */}
          <p className="text-sm font-semibold text-base-content/70">{label}</p>
          {/* The icon is now subtly styled with the theme color. */}
          <div
            className={`p-2 rounded-md bg-base-content/5 ${colorClasses[color]}`}
          >
            {icon}
          </div>
        </div>

        {/* The main value is now the "hero" of the card. */}
        <p className="text-4xl font-bold mt-2">{value}</p>

        {/* --- 4. OPTIONAL CALL TO ACTION --- */}
        {/* If a `link` prop is provided, a "View all" link is rendered at the bottom. */}
        {link && (
          <div className="card-actions mt-2">
            <Link
              href={link}
              className={`link link-hover text-sm ${
                colorClasses[color].split(" ")[0]
              }`}
            >
              {linkText}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStatCard;
