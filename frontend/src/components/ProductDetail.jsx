import React from 'react';
import { ArrowLeft, LogOut } from 'lucide-react';
import { formatPrice, getRatingFor } from '../data/products.js';
import ProductArt from './ProductArt.jsx';
import StarRating from './StarRating.jsx';

export default function ProductDetail({ product, onAddToCart, onAbandon, onBack }) {
  if (!product) return null;
  const { rating, reviews } = getRatingFor(product.id);

  return (
    <section>
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-ink-mid transition-colors hover:text-orange sm:mb-6"
      >
        <ArrowLeft size={14} strokeWidth={2} />
        Back to Browsing
      </button>

      <p className="data-label mb-3">step 02 · view item details</p>

      <div className="surface-card flex flex-col gap-8 p-5 sm:p-8 md:flex-row md:p-10">
        <div className="w-full shrink-0 md:w-64">
          <ProductArt art={product.art} accent={product.accent} image={product.image} aspect="square" />
        </div>

        <div className="flex flex-1 flex-col">
          <p className="data-label mb-2">{product.category}</p>
          <h1 className="font-display text-2xl font-semibold text-ink-high sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-2">
            <StarRating rating={rating} reviews={reviews} size={15} />
          </div>

          <p className="mt-3 font-mono text-lg font-semibold text-ink-high sm:text-xl">
            {formatPrice(product.price)}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-mid sm:mt-5 sm:text-base">
            {product.description}
          </p>

          <div className="fine-divider my-6 sm:my-7" />

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={onAddToCart} className="btn-orange w-full sm:w-auto">
              Add to Cart
            </button>
            <button
              type="button"
              onClick={onAbandon}
              className="btn-ghost-danger inline-flex w-full items-center justify-center gap-1.5 sm:w-auto"
            >
              <LogOut size={14} strokeWidth={2} />
              Exit Session
            </button>
          </div>
          <p className="mt-4 text-xs text-ink-low">
            Exiting logs an abandoned session at this step — this is expected and useful data.
          </p>
        </div>
      </div>
    </section>
  );
}
