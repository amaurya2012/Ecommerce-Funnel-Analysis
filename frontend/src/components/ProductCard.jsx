import React from 'react';
import { Heart } from 'lucide-react';
import { formatPrice, getRatingFor } from '../data/products.js';
import ProductArt from './ProductArt.jsx';
import StarRating from './StarRating.jsx';

export default function ProductCard({ product, onSelect, isWishlisted, onToggleWishlist, index = 0 }) {
  const { rating, reviews } = getRatingFor(product.id);

  function handleWishlistToggle(event) {
    event.stopPropagation();
    onToggleWishlist(product.id);
  }

  return (
    <div
      style={{ animationDelay: `${index * 35}ms` }}
      className="surface-card group flex animate-riseIn flex-col overflow-hidden p-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-3"
    >
      <div className="relative">
        <ProductArt art={product.art} accent={product.accent} image={product.image} />
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label="Toggle wishlist"
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-card transition-transform active:scale-90"
        >
          <Heart
            size={14}
            strokeWidth={2}
            className={isWishlisted ? 'fill-orange text-orange' : 'text-ink-mid'}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-1 pt-3">
        <p className="data-label text-[9px] sm:text-[10px]">{product.category}</p>
        <h3 className="mt-1 font-display text-sm font-medium leading-snug text-ink-high sm:text-base">
          {product.name}
        </h3>

        <div className="mt-1.5">
          <StarRating rating={rating} reviews={reviews} />
        </div>

        <p className="mt-2 font-mono text-sm font-semibold text-ink-high sm:text-base">
          {formatPrice(product.price)}
        </p>

        <button
          type="button"
          onClick={() => onSelect(product.id)}
          className="btn-orange mt-3 w-full !py-2.5 text-xs sm:text-sm"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
