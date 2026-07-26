import React from 'react';
import { Shirt, Watch, Footprints, Gem, Sparkles } from 'lucide-react';

const TILES = [
  {category: 'All', label: 'All Products', Icon: Sparkles },
  { category: 'Menswear', label: "Men's", Icon: Shirt },
  { category: 'Womenswear', label: "Women's", Icon: Shirt},
  { category: 'Watches', label: 'Timepieces', Icon: Watch },
  { category: 'Footwear', label: 'Footwear', Icon: Footprints },
  { category: 'Accessories', label: 'Accessories', Icon: Gem },
];

export default function CategoryTiles({ activeCategory, onSelectCategory }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
      {TILES.map(({ category, label, Icon }) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(isActive ? 'All' : category)}
            className={[
              'flex items-center justify-center gap-3 rounded-xl px-5 py-4 transition-all duration-300 border text-center group w-full shadow-sm',
              isActive 
                ? 'bg-navy border-orange text-white shadow-md' 
                : 'bg-navy/90 border-transparent hover:bg-navy text-white/90'
            ].join(' ')}
          >
            <Icon 
              size={17} 
              strokeWidth={isActive ? 2 : 1.5} 
              className={[
                'shrink-0 transition-colors duration-300 text-orange',
              ].join(' ')} 
            />
            
            <span 
              className={[
                'font-sans text-xs sm:text-sm tracking-wide transition-colors duration-300 text-white',
                isActive ? 'font-semibold' : 'font-medium text-white/90 group-hover:text-white'
              ].join(' ')}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}