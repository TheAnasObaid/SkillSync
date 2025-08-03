import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  label: string;
  value: number | string;
  link?: string;
  linkText?: string;
  color?: "green" | "blue" | "orange" | "red";
}

const StateCard = ({
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
    <div className="card bg-base-200/50 border border-base-300 shadow-md transition-all hover:shadow-lg">
      <div className="card-body p-6">
        <div className="flex justify-between items-start">
          <p className="text-sm font-semibold text-base-content/70">{label}</p>
          <div
            className={`p-2 rounded-md bg-base-content/5 ${colorClasses[color]}`}
          >
            {icon}
          </div>
        </div>
        <p className="text-4xl font-bold mt-2">{value}</p>
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

export default StateCard;
