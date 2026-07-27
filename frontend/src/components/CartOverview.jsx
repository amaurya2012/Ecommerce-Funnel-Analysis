import React, { useMemo } from 'react';
import { ShoppingBag, LogOut, X } from 'lucide-react';
import { formatPrice } from '../data/products.js';
import ProductArt from './ProductArt.jsx';

function groupCartItems(cartItems) {
  const groups = [];
  const indexById = new Map();

  for (const item of cartItems) {
    if (indexById.has(item.id)) {
      groups[indexById.get(item.id)].quantity += 1;
    } else {
      indexById.set(item.id, groups.length);
      groups.push({ ...item, quantity: 1 });
    }
  }

  return groups;
}

export default function CartOverview({ cartItems, onPlaceOrder, onAbandon, onRemoveItem }) {
  const groupedItems = useMemo(() => groupCartItems(cartItems), [cartItems]);
  const totalUnits = cartItems.length;
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const shipping = subtotal > 0 ? 249 : 0;
  const total = subtotal + shipping;

  return (
    <section>
      <p className="data-label mb-3">step 03 · your cart</p>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink-high sm:text-3xl">
        Your Cart ({totalUnits} {totalUnits === 1 ? 'item' : 'items'})
      </h1>

      <div className="surface-card p-5 sm:p-8">
        {groupedItems.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <ShoppingBag size={28} strokeWidth={1.5} className="mb-3 text-ink-low" />
            <p className="text-ink-mid">Your cart is empty.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-4 sm:gap-5">
            {groupedItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-4 border-b border-line pb-4 last:border-none last:pb-0"
              >
                <div className="h-16 w-16 shrink-0 sm:h-20 sm:w-20">
                  <ProductArt art={item.art} accent={item.accent} image={item.image} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-ink-high">{item.name}</p>
                  <p className="data-label mt-1">
                    {item.category} · Qty {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-semibold text-ink-high">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  {item.quantity > 1 && (
                    <p className="mt-0.5 font-mono text-xs text-ink-low">{formatPrice(item.price)} each</p>
                  )}
                </div>
                {onRemoveItem && (
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label="Remove item"
                    className="text-ink-low transition-colors hover:text-signal-danger"
                  >
                    <X size={16} strokeWidth={2} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="fine-divider my-6" />

        <div className="flex flex-col gap-2 font-mono text-sm text-ink-mid">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{formatPrice(shipping)}</span>
          </div>
          <div className="mt-2 flex justify-between text-base font-semibold text-ink-high">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onPlaceOrder}
            disabled={groupedItems.length === 0}
            className="btn-navy w-full disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            Proceed to Checkout
          </button>
          <button
            type="button"
            onClick={onAbandon}
            className="btn-ghost-danger inline-flex w-full items-center justify-center gap-1.5 sm:w-auto"
          >
            <LogOut size={14} strokeWidth={2} />
            Abandon Cart
          </button>
        </div>
      </div>
    </section>
  );
}