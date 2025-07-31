"use client";

import useImageFallback from "@/hooks/useImageFallback";
import { PortfolioItem } from "@/types";
import Link from "next/link";
import { FiExternalLink, FiGithub, FiTrash } from "react-icons/fi";

interface Props {
  item: PortfolioItem;
  onDelete: (item: PortfolioItem) => void;
  isOwner: boolean;
}

const PortfolioCard = ({ item, onDelete, isOwner }: Props) => {
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const primaryImageUrl = item.imageUrl.startsWith("http")
    ? item.imageUrl
    : `${API_URL}/${item.imageUrl.replace(/\\/g, "/")}`;
  const placeholderImageUrl =
    "https://placehold.co/600x400/1a1a1a/ffffff?text=Project";

  const imageProps = useImageFallback(primaryImageUrl, placeholderImageUrl);

  return (
    <div className="card bg-base-200/50 border border-base-300 shadow-md transition-all hover:border-primary/50 group">
      <figure className="relative h-48 bg-base-300">
        {" "}
        <img
          {...imageProps}
          alt={item.title}
          className="object-cover w-full h-full"
        />
        {isOwner && (
          <button
            onClick={() => onDelete(item)}
            className="btn btn-sm btn-circle btn-error absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Delete project"
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
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
            >
              <FiGithub /> GitHub
            </Link>
          )}
          {item.liveUrl && (
            <Link
              href={item.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
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
