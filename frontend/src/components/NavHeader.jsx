import React, { useState } from 'react';
import { Search, User, Heart, ShoppingBag, X, LogIn } from 'lucide-react';
import { useTelemetryContext } from '../context/TelemetryContext.jsx';

export default function NavHeader({
  cartCount = 0,
  wishlistCount = 0,
  searchQuery,
  onSearchChange,
  onCartClick,
  onWishlistClick,
}) {
  const { sessionId, deviceType, variant } = useTelemetryContext();
  const [accountOpen, setAccountOpen] = useState(false);
  const shortSession = sessionId.split('_').slice(-1)[0];

  return (
    <header className="sticky top-0 z-30 bg-navy">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3.5 sm:px-6 sm:py-4 md:px-10">
        <span className="font-display text-lg font-semibold tracking-[0.1em] text-white sm:text-xl">
          AURELLE
        </span>

        <div className="hidden flex-1 items-center gap-2 rounded-full bg-white/10 px-4 py-2 sm:flex">
          <Search size={15} strokeWidth={2} className="text-white/50" />
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search apparel, footwear…"
            className="w-full bg-transparent font-body text-sm text-white outline-none placeholder:text-white/45"
          />
          {searchQuery && (
            <button type="button" onClick={() => onSearchChange('')} aria-label="Clear search">
              <X size={14} className="text-white/60" />
            </button>
          )}
        </div>

        <div className="ml-auto flex items-center gap-3 sm:gap-4">
          <span className="data-label hidden rounded-full bg-white/10 px-3 py-1.5 text-white/60 lg:inline">
            {deviceType} · {shortSession} · variant {variant}
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setAccountOpen((open) => !open)}
              aria-label="Account"
              className="text-white/80 transition-colors hover:text-white"
            >
              <User size={19} strokeWidth={1.75} />
            </button>
            {accountOpen && (
              <div className="surface-card absolute right-0 top-8 z-40 w-48 p-3">
                <p className="text-sm font-medium text-ink-high">Guest visitor</p>
                <p className="mt-1 text-xs text-ink-low">Session {shortSession}</p>
                <button
                  type="button"
                  onClick={() => setAccountOpen(false)}
                  className="mt-3 flex w-full items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-xs font-medium text-ink-high"
                >
                  <LogIn size={12} strokeWidth={2} /> Sign in (demo only)
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onWishlistClick}
            aria-label="Wishlist"
            className="relative text-white/80 transition-colors hover:text-white"
          >
            <Heart size={19} strokeWidth={1.75} fill={wishlistCount > 0 ? 'currentColor' : 'none'} />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange text-[10px] font-semibold text-white">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onCartClick}
            aria-label="View cart"
            className="relative text-white/80 transition-colors hover:text-white"
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

      <div className="flex items-center gap-2 border-t border-white/10 px-4 py-2 sm:hidden">
        <Search size={14} strokeWidth={2} className="text-white/50" />
        <input
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search apparel, footwear…"
          className="w-full bg-transparent font-body text-xs text-white outline-none placeholder:text-white/45"
        />
      </div>
    </header>
  );
}