import React, { useMemo, useRef, useState } from 'react';
import { PRODUCTS } from '../data/products.js';
import Hero from './Hero.jsx';
import CategoryTiles from './CategoryTiles.jsx';
import ProductCard from './ProductCard.jsx';

export default function BrowseProducts({
  onSelectProduct,
  searchQuery,
  wishlist,
  onToggleWishlist,
  wishlistOnly,
  onClearWishlistOnly,
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const gridRef = useRef(null);

  const visibleProducts = useMemo(() => {
    let list = PRODUCTS;

    if (activeCategory !== 'All') {
      list = list.filter((product) => product.category === activeCategory);
    }
    if (wishlistOnly) {
      list = list.filter((product) => wishlist.has(product.id));
    }
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      list = list.filter(
        (product) =>
          product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query)
      );
    }

    return list;
  }, [activeCategory, searchQuery, wishlist, wishlistOnly]);

  function scrollToGrid() {
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const showHeroAndTiles = !wishlistOnly && !searchQuery.trim();

  const heading = wishlistOnly
    ? 'Your Wishlist'
    : searchQuery.trim()
    ? `Results for "${searchQuery.trim()}"`
    : 'Popular Products';

  return (
    <section>
      <p className="data-label mb-3">step 01 · browse items</p>

      {showHeroAndTiles && <Hero onShopNow={scrollToGrid} />}

      {showHeroAndTiles && (
        <div className="mt-8 sm:mt-10">
          <CategoryTiles activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
        </div>
      )}

      <div ref={gridRef} className="mt-10 scroll-mt-24 sm:mt-14">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2 sm:mb-6">
          <h2 className="text-xl font-semibold text-ink-high sm:text-2xl">{heading}</h2>

          <div className="flex gap-3">
            {wishlistOnly && (
              <button
                type="button"
                onClick={onClearWishlistOnly}
                className="text-xs font-medium text-orange hover:underline sm:text-sm"
              >
                Back to shop
              </button>
            )}
            {!wishlistOnly && activeCategory !== 'All' && (
              <button
                type="button"
                onClick={() => setActiveCategory('All')}
                className="text-xs font-medium text-orange hover:underline sm:text-sm"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        {visibleProducts.length === 0 ? (
          <div className="surface-card py-16 text-center">
            <p className="text-ink-mid">No items match right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {visibleProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                isWishlisted={wishlist.has(product.id)}
                onToggleWishlist={onToggleWishlist}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
