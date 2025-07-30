import useImageFallback from "@/hookes/useImageFallback";
import Link from "next/link";
import { FiExternalLink, FiGithub, FiTrash } from "react-icons/fi";

export interface PortfolioItem {
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
}

interface PortfolioCardProps {
  item: PortfolioItem;
  onDelete: (item: PortfolioItem) => void;
  isOwner: boolean; // To show/hide the delete button
}

const PortfolioCard = ({ item, onDelete, isOwner }: PortfolioCardProps) => {
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const primaryImageUrl = `${API_URL}/${item.imageUrl.replace(/\\/g, "/")}`;
  const placeholderImageUrl =
    "https://placehold.co/600x400/1a1a1a/ffffff?text=Project"; // <-- Your consistent placeholder

  // === 2. USE THE HOOK ===
  const imageProps = useImageFallback(primaryImageUrl, placeholderImageUrl);

  return (
    <div className="card bg-base-200/50 border border-base-300 shadow-md transition-all hover:border-primary/50 group">
      <figure className="relative h-48">
        <img
          {...imageProps}
          alt={item.title}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isOwner && (
          <button
            onClick={() => onDelete(item)}
            className="btn btn-sm btn-circle btn-error absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiTrash />
          </button>
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title">{item.title}</h2>
        <p className="text-base-content/70 text-sm flex-grow">
          {item.description}
        </p>
        <div className="card-actions justify-end mt-4">
          {item.githubUrl && (
            <Link
              href={item.githubUrl}
              target="_blank"
              className="btn btn-ghost btn-sm"
            >
              <FiGithub /> GitHub
            </Link>
          )}
          {item.liveUrl && (
            <Link
              href={item.liveUrl}
              target="_blank"
              className="btn btn-ghost btn-sm"
            >
              <FiExternalLink /> Live Demo
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
