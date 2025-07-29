"use client";

import { useState } from "react";
import { FiStar } from "react-icons/fi";

interface StarRatingProps {
  count?: number;
  value: number;
  onChange: (rating: number) => void;
  size?: number;
  color?: string;
  hoverColor?: string;
}

const StarRating = ({
  count = 5,
  value,
  onChange,
  size = 24,
  color = "text-base-content/30",
  hoverColor = "text-warning",
}: StarRatingProps) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(count)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <label key={i} className="cursor-pointer">
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => onChange(ratingValue)}
              className="hidden"
            />
            <FiStar
              size={size}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
              className={`transition-colors ${
                ratingValue <= (hover || value) ? hoverColor : color
              }`}
              fill={ratingValue <= (hover || value) ? "currentColor" : "none"}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;
