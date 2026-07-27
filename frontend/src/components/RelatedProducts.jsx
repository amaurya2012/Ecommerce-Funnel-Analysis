import React, { useMemo } from 'react';
import { PRODUCTS, formatPrice, getRatingFor } from '../data/products.js';
import ProductArt from './ProductArt.jsx';
import StarRating from './StarRating.jsx';

export default function RelatedProducts({ currentProduct, onSelectProduct }) {
  const related = useMemo(() => {
    const sameCategory = PRODUCTS.filter(
      (p) => p.category === currentProduct.category && p.id !== currentProduct.id
    );
    const others = PRODUCTS.filter(
      (p) => p.category !== currentProduct.category && p.id !== currentProduct.id
    );
    return [...sameCategory, ...others].slice(0, 4);
  }, [currentProduct]);

  if (related.length === 0) return null;

  return (
    <div className="mt-10 sm:mt-14">
      <h2 className="mb-5 font-display text-xl font-semibold text-ink-high sm:mb-6 sm:text-2xl">
        You may also like
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {related.map((product) => {
          const { rating, reviews } = getRatingFor(product.id);
          return (
            <button
              key={product.id}
              type="button"
              onClick={() => onSelectProduct(product.id)}
              className="surface-card flex flex-col items-start p-2.5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-3"
            >
              <ProductArt art={product.art} accent={product.accent} image={product.image} />
              <p className="data-label mb-1 mt-3 text-[9px] sm:text-[10px]">{product.category}</p>
              <h3 className="font-display text-sm font-medium leading-snug text-ink-high sm:text-base">
                {product.name}
              </h3>
              <div className="mt-1.5">
                <StarRating rating={rating} reviews={reviews} />
              </div>
              <p className="mt-2 font-mono text-sm font-semibold text-ink-high sm:text-base">
                {formatPrice(product.price)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}