import Link from "next/link";
import { ReactNode } from "react";
import { FiInbox } from "react-icons/fi"; // FiInbox is a great generic icon for "empty"

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message: string;
  ctaText: string;
  ctaLink: string;
}

const EmptyState = ({
  // Provide default values for a common use case
  icon = <FiInbox className="mx-auto text-5xl text-base-content/30" />,
  title = "Nothing Here Yet",
  message = "There's no data to display at the moment.",
  ctaText = "Get Started",
  ctaLink = "/",
}: EmptyStateProps) => {
  return (
    <div className="card bg-base-200/50 border border-base-300">
      <div className="card-body items-center text-center p-12">
        {icon}
        <h2 className="card-title text-2xl font-bold mt-4">{title}</h2>
        <p className="text-base-content/70">{message}</p>
        <div className="card-actions mt-4">
          <Link href={ctaLink} className="btn btn-primary">
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
