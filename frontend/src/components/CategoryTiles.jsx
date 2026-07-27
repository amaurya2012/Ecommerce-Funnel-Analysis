import React from 'react';
import { Shirt, Watch, Footprints, Gem, Sparkles, Star } from 'lucide-react';

const TILES = [
  { category: 'All', label: 'All Products', Icon: Sparkles },
  { category: 'Menswear', label: "Men's", Icon: Shirt },
  { category: 'Womenswear', label: "Women's", Icon: Shirt },
  { category: 'Watches', label: 'Time pieces', Icon: Watch },
  { category: 'Footwear', label: 'Foot wear', Icon: Footprints },
  { category: 'Accessories', label: 'Accessories', Icon: Gem },
  { category: 'New-Arrivals', label: 'New Arrivals', Icon: Star },
];

export default function CategoryTiles({ activeCategory, onSelectCategory }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
      {TILES.map(({ category, label, Icon }) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(isActive ? 'All' : category)}
            className={[
              'flex items-center gap-3 rounded-xl px-4 py-4 text-left transition-all duration-200 sm:py-5',
              isActive ? 'bg-navy shadow-card-hover' : 'bg-navy/90 hover:bg-navy',
            ].join(' ')}
          >
            <Icon size={18} strokeWidth={1.5} className="shrink-0 text-orange" />
            <span className="font-body text-xs font-semibold uppercase tracking-wide text-white sm:text-sm">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}