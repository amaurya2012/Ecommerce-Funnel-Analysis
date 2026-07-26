import React from 'react';
import { User, Heart, ShoppingBag, Search, X, LogIn } from 'lucide-react';

export default function NavHeader({
  searchQuery,
  onSearchChange,
  wishlistCount,
  cartCount,
  onWishlistClick,
  onCartClick,
  accountOpen,
  setAccountOpen,
  onNavClick
}) {
  return (
    <header className="bg-navy text-white px-4 py-3 sm:px-6 md:px-8 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left Section: Logo & Quick Premium Nav Links */}
        <div className="flex items-center gap-8">
          <button
            type="button"
            onClick={() => {
              console.log("Logo Clicked");
              if (onNavClick) onNavClick('All', 'logo_click');
            }} 
            className="text-xl font-serif font-bold tracking-widest text-white cursor-pointer select-none bg-transparent border-none outline-none"
          >
            AURELLE
          </button>
          
          {/* Desktop Navigation Links — Strict Button Architecture */}
          <nav className="hidden md:flex items-center gap-6 text-xs tracking-widest uppercase text-white/70 font-sans">
            <button 
              type="button"
              onClick={() => {
                console.log("NEW ARRIVALS Clicked");
                if (onNavClick) onNavClick('New-Arrivals', 'nav_new_arrivals');
              }}
              className="hover:text-white transition-colors cursor-pointer bg-transparent border-none outline-none font-sans font-medium text-xs tracking-widest"
            >
              NEW ARRIVALS
            </button>
            <button 
              type="button"
              onClick={() => {
                console.log("COLLECTIONS Clicked");
                if (onNavClick) onNavClick('All', 'nav_collections');
              }}
              className="hover:text-white transition-colors cursor-pointer bg-transparent border-none outline-none font-sans font-medium text-xs tracking-widest"
            >
              COLLECTIONS
            </button>
          </nav>
        </div>

        {/* Center Section: High-Contrast Search Bar */}
        <div className="hidden sm:flex flex-1 max-w-md items-center gap-2 rounded-lg bg-white/10 px-3 py-2 border border-white/10 transition-all focus-within:bg-white/15 focus-within:border-white/30">
          <Search size={15} className="text-white/60 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search apparel, footwear…"
            className="w-full bg-transparent font-sans text-xs text-white outline-none placeholder:text-white/50"
          />
          {searchQuery && (
            <button type="button" onClick={() => onSearchChange('')} aria-label="Clear search">
              <X size={14} className="text-white/60 hover:text-white" />
            </button>
          )}
        </div>

        {/* Right Section: Aligned Action Icons */}
        <div className="ml-auto flex items-center justify-center gap-6">
          
          {/* Profile Dropdown */}
          <div className="relative flex items-center justify-center">
            <button
              type="button"
              onClick={() => setAccountOpen((open) => !open)}
              aria-label="Account"
              className="flex items-center justify-center text-white/80 transition-colors hover:text-white bg-transparent border-none outline-none"
            >
              <User size={19} strokeWidth={1.75} />
            </button>
            {accountOpen && (
              <div className="absolute right-0 top-10 z-40 w-40 rounded-lg bg-[#1a202c] p-2 shadow-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setAccountOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-orange text-white px-3 py-2 text-xs font-semibold hover:bg-orange/90 transition-colors"
                >
                  <LogIn size={13} strokeWidth={2} /> Sign in
                </button>
              </div>
            )}
          </div>

          {/* Wishlist Icon */}
          <button
            type="button"
            onClick={onWishlistClick}
            aria-label="Wishlist"
            className="flex items-center justify-center relative text-white/80 transition-colors hover:text-white bg-transparent border-none outline-none"
          >
            <Heart size={19} strokeWidth={1.75} fill={wishlistCount > 0 ? 'currentColor' : 'none'} />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange text-[10px] font-semibold text-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Icon */}
          <button
            type="button"
            onClick={onCartClick}
            aria-label="View cart"
            className="flex items-center justify-center relative text-white/80 transition-colors hover:text-white bg-transparent border-none outline-none"
          >
            <ShoppingBag size={19} strokeWidth={1.75} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="flex items-center gap-2 border-t border-white/10 px-4 py-2 mt-2 sm:hidden">
        <Search size={14} strokeWidth={2} className="text-white/50" />
        <input
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search apparel, footwear…"
          className="w-full bg-transparent font-sans text-xs text-white outline-none placeholder:text-white/50"
        />
      </div>
    </header>
  );
}