import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating, reviews, size = 13 }) {
  const fullStars = Math.round(rating);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={size}
            strokeWidth={0}
            className={index < fullStars ? 'fill-orange text-orange' : 'fill-line text-line'}
          />
        ))}
      </div>
      <span className="font-mono text-[11px] text-ink-mid">
        {rating.toFixed(1)} <span className="text-ink-low">({reviews})</span>
      </span>
    </div>
  );
}
