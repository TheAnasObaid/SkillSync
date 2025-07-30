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
  return (
    <div className="card bg-base-200/50 border border-base-300 shadow-md transition-all hover:border-primary/50 group">
      <figure className="relative h-48">
        {/* We use next/image in a real app, but img is fine for now */}
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover"
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
