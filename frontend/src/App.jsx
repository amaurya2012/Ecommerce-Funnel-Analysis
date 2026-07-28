import React, { useEffect, useState } from 'react';
import NavHeader from './components/NavHeader.jsx';
import SessionTrail from './components/SessionTrail.jsx';
import BrowseProducts from './components/BrowseProducts.jsx';
import ProductDetail from './components/ProductDetail.jsx';
import CartOverview from './components/CartOverview.jsx';
import CheckoutConfirmation from './components/CheckoutConfirmation.jsx';
import Toast from './components/Toast.jsx';
import InfoModal from './components/InfoModal.jsx';
import { AboutContent, FaqContent, ContactContent } from './components/InfoContent.jsx';
import { useTelemetryContext } from './context/TelemetryContext.jsx';
import { getProductById, formatPrice } from './data/products.js';

const VIEWS = {
  BROWSE: 'browse',
  PRODUCT_DETAIL: 'product_detail',
  CART: 'cart',
  CHECKOUT: 'checkout',
};

export default function App() {
  const { logTransition, startNewSession, sessionId } = useTelemetryContext();

  const [view, setView] = useState(VIEWS.BROWSE);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [lastOrderTotal, setLastOrderTotal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState(() => new Set());
  const [wishlistOnly, setWishlistOnly] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [activeInfoPanel, setActiveInfoPanel] = useState(null);

  useEffect(() => {
    logTransition('entry', VIEWS.BROWSE, 'view');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  function handleSelectProduct(productId) {
    logTransition(VIEWS.BROWSE, VIEWS.PRODUCT_DETAIL, 'view');
    setSelectedProductId(productId);
    setView(VIEWS.PRODUCT_DETAIL);
  }

  function handleBackToBrowse() {
    setView(VIEWS.BROWSE);
    setSelectedProductId(null);
  }

  function handleAddToCart(quantity = 1) {
    const product = getProductById(selectedProductId);
    if (!product) return;
    logTransition(VIEWS.PRODUCT_DETAIL, VIEWS.CART, 'add_to_cart');
    setCartItems((prev) => [...prev, ...Array(quantity).fill(product)]);
    const quantityLabel = quantity > 1 ? `${quantity} × ` : '';
    setToast({ visible: true, message: `Added ${quantityLabel}${product.name} to cart` });
    setView(VIEWS.CART);
  }

  function handlePlaceOrder() {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0) + 249;
    logTransition(VIEWS.CART, VIEWS.CHECKOUT, 'purchase');
    setLastOrderTotal(formatPrice(total));
    setView(VIEWS.CHECKOUT);
  }

  function handleAbandon(currentStep) {
    logTransition(currentStep, currentStep, 'abandon');
    resetSimulation();
  }

  function handleRemoveItem(productId) {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }

  function handleSelectRelatedProduct(productId) {
    logTransition(VIEWS.PRODUCT_DETAIL, VIEWS.PRODUCT_DETAIL, 'view');
    setSelectedProductId(productId);
  }

  function resetSimulation() {
    setCartItems([]);
    setSelectedProductId(null);
    setView(VIEWS.BROWSE);
    setSearchQuery('');
    setWishlistOnly(false);
    startNewSession();
  }

  function handleSearchChange(query) {
    setSearchQuery(query);
    setWishlistOnly(false);
    if (view !== VIEWS.BROWSE) {
      setView(VIEWS.BROWSE);
    }
  }

  function handleCartIconClick() {
    setView(VIEWS.CART);
  }

  function handleWishlistIconClick() {
    setSearchQuery('');
    setWishlistOnly(true);
    setView(VIEWS.BROWSE);
  }

  function handleToggleWishlist(productId) {
    const product = getProductById(productId);
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
        if (product) setToast({ visible: true, message: `Removed ${product.name} from wishlist` });
      } else {
        next.add(productId);
        if (product) setToast({ visible: true, message: `Added ${product.name} to wishlist` });
      }
      return next;
    });
  }

  const selectedProduct = selectedProductId ? getProductById(selectedProductId) : null;

  return (
    <div className="min-h-screen">
      <NavHeader
        cartCount={cartItems.length}
        wishlistCount={wishlist.size}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onCartClick={handleCartIconClick}
        onWishlistClick={handleWishlistIconClick}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 md:px-10">
        <div className="mb-8 sm:mb-10">
          <SessionTrail currentStepKey={view} />
        </div>

        {view === VIEWS.BROWSE && (
          <BrowseProducts
            onSelectProduct={handleSelectProduct}
            searchQuery={searchQuery}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            wishlistOnly={wishlistOnly}
            onClearWishlistOnly={() => setWishlistOnly(false)}
          />
        )}

        {view === VIEWS.PRODUCT_DETAIL && (
          <ProductDetail
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onAbandon={() => handleAbandon(VIEWS.PRODUCT_DETAIL)}
            onBack={handleBackToBrowse}
            onSelectProduct={handleSelectRelatedProduct}
          />
        )}

        {view === VIEWS.CART && (
          <CartOverview
            cartItems={cartItems}
            onPlaceOrder={handlePlaceOrder}
            onAbandon={() => handleAbandon(VIEWS.CART)}
            onRemoveItem={handleRemoveItem}
          />
        )}

        {view === VIEWS.CHECKOUT && (
          <CheckoutConfirmation orderTotal={lastOrderTotal} onStartOver={resetSimulation} />
        )}
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-8 pt-4 sm:px-6 sm:pb-10 md:px-10">
        <div className="fine-divider mb-4" />

        <div className="mb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <button
            type="button"
            onClick={() => setActiveInfoPanel('about')}
            className="text-xs font-medium text-ink-mid transition-colors hover:text-orange sm:text-sm"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => setActiveInfoPanel('faq')}
            className="text-xs font-medium text-ink-mid transition-colors hover:text-orange sm:text-sm"
          >
            FAQ
          </button>
          <button
            type="button"
            onClick={() => setActiveInfoPanel('contact')}
            className="text-xs font-medium text-ink-mid transition-colors hover:text-orange sm:text-sm"
          >
            Contact
          </button>
        </div>

        <p className="text-center text-xs font-medium text-ink-mid">
          AURELLE | © 2026 All Rights Reserved
        </p>

        <p className="data-label mt-4 text-center text-[9px] leading-relaxed sm:text-[11px]">
          every transition streams to user_behavior_logs.csv for funnel analysis
        </p>
      </footer>

      <InfoModal title="About AURELLE" isOpen={activeInfoPanel === 'about'} onClose={() => setActiveInfoPanel(null)}>
        <AboutContent />
      </InfoModal>
      <InfoModal title="Frequently Asked Questions" isOpen={activeInfoPanel === 'faq'} onClose={() => setActiveInfoPanel(null)}>
        <FaqContent />
      </InfoModal>
      <InfoModal title="Contact Us" isOpen={activeInfoPanel === 'contact'} onClose={() => setActiveInfoPanel(null)}>
        <ContactContent />
      </InfoModal>

      <Toast
        message={toast.message}
        visible={toast.visible}
        onDismiss={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
}