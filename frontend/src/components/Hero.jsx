import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products.js';
import ProductArt from './ProductArt.jsx';

const SPOTLIGHT_IDS = ['p-101', 'p-102', 'p-109'];

export default function Hero({ onShopNow }) {
  const spotlightProducts = SPOTLIGHT_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);

  return (
    <section className="overflow-hidden rounded-2xl bg-[#0f172a] shadow-xl border border-white/5">
      <div className="grid grid-cols-1 items-center gap-10 px-8 py-12 sm:px-12 sm:py-16 md:grid-cols-[1fr_1.1fr] md:gap-12 md:px-16">
        
        {/* Left Info Column */}
        <div className="flex flex-col items-start">
          {/* "THE WINTER EDIT" tag successfully removed from here */}
          
          <h1 className="text-3xl font-serif font-normal leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl">
            Pieces that earn
            <br />
            a permanent place.
          </h1>
          
          <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-slate-400 sm:text-base">
            Curated staples designed to outlast trends. 
            A quiet collection of premium wear, timeless watches, and essentials for the modern wardrobe.
          </p>
          
          <button 
            type="button" 
            onClick={onShopNow} 
            className="mt-8 inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-orange text-white font-medium text-sm transition-all duration-300 hover:bg-orange/90 hover:scale-[1.02] shadow-lg shadow-orange/10"
          >
            Explore the Collection
            <ArrowRight size={15} strokeWidth={2.25} />
          </button>
        </div>

        {/* Right Product Grid - Restructured for larger image scale */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 items-center pt-4 md:pt-0 w-full">
          {spotlightProducts.map((product, index) => (
            <div
              key={product.id}
              className={[
                'overflow-hidden rounded-xl border border-white/10 shadow-2xl bg-[#1e293b] transition-all duration-500 hover:scale-105 w-full h-full min-h-[140px] sm:min-h-[200px] flex items-stretch',
                index === 0 && 'translate-y-4',
                index === 1 && '-translate-y-4',
                index === 2 && 'translate-y-2',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {/* Aspect square and w-full ensures the image fills the entire card background */}
              <div className="w-full h-full object-cover">
                <ProductArt art={product.art} accent={product.accent} image={product.image} aspect="square" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}