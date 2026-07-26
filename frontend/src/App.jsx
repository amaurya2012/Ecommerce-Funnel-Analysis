import React, { useState, useEffect } from 'react';
import NavHeader from './components/NavHeader.jsx';
import SessionTrail from './components/SessionTrail.jsx';
import Hero from './components/Hero.jsx';
import CategoryTiles from './components/CategoryTiles.jsx';
import ProductArt from './components/ProductArt.jsx';
import { PRODUCTS } from './data/products.js';
import { Heart, Star, Terminal, EyeOff, CheckCircle, Trash2, ShoppingBag } from 'lucide-react';

export default function App() {
  // Application Dynamic States
  const [currentStepKey, setCurrentStepKey] = useState('browse');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [accountOpen, setAccountOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Toast Messages & Dashboard Logs Feeds States
  const [toastMessage, setToastMessage] = useState('');
  const [showLogsPanel, setShowLogsPanel] = useState(false);
  const [simulatedLogs, setSimulatedLogs] = useState([]);

  // Toast Trigger Helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Telemetry logger stream
  const logTransition = async (actionType, details = {}) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      id: Math.random().toString(36).substr(2, 5).toUpperCase(),
      time: timestamp,
      action: actionType,
      step: currentStepKey,
      ...details
    };
    
    setSimulatedLogs(prev => [logEntry, ...prev.slice(0, 14)]);

    try {
      await fetch('http://localhost:4000/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: currentStepKey,
          action: actionType,
          category: activeCategory,
          timestamp: new Date().toISOString(),
          ...details
        })
      });
    } catch (err) {
      console.error('Telemetry stream offline:', err);
    }
  };

  // Track steps changes
  useEffect(() => {
    logTransition('page_view', { details: `Step view active: ${currentStepKey}` });
  }, [currentStepKey]);

  // Wishlist Toggle Handler
  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const isAdded = prev.includes(productId);
      const updated = isAdded ? prev.filter((id) => id !== productId) : [...prev, productId];
      
      triggerToast(isAdded ? 'Removed from Wishlist' : 'Added to Wishlist!');
      logTransition(isAdded ? 'remove_from_wishlist' : 'add_to_wishlist', { productId });
      return updated;
    });
  };

  // Cart Add Handler
  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    triggerToast(`"${product.name}" added to shopping bag!`);
    setCurrentStepKey('cart');
    logTransition('add_to_cart', { productId: product.id, price: product.price });
  };

  // STRICT FILTERING LOGIC FOR CHOSEN NAVIGATION TARGETS
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = 
      activeCategory === 'All' || 
      product.category === activeCategory;
      
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get full details of items currently in the wishlist
  const wishlistItems = PRODUCTS.filter((product) => wishlist.includes(product.id));

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 font-sans antialiased flex flex-col justify-between relative overflow-x-hidden">
      
      {/* Dynamic Toast Alert Pop-up */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-white/10">
          <CheckCircle size={14} className="text-orange" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Header Layout */}
      <div>
        <NavHeader 
          searchQuery={searchQuery}
          onSearchChange={(val) => {
            setSearchQuery(val);
            if(val) logTransition('search_input', { query: val });
          }}
          wishlistCount={wishlist.length}
          cartCount={cart.length}
          onWishlistClick={() => {
            setCurrentStepKey('wishlist');
            logTransition('click_wishlist_view');
          }}
          onCartClick={() => {
            setCurrentStepKey('cart');
            logTransition('click_cart_view');
          }}
          accountOpen={accountOpen}
          setAccountOpen={setAccountOpen}
          onNavClick={(category, actionName) => {
            // FORCEFUL RESET ON ANY NAVBAR LINK CLICK
            setSearchQuery(''); 
            setActiveCategory(category);
            setCurrentStepKey('browse'); 
            logTransition(actionName, { targetCategory: category });
          }}
        />

        {/* Funnel Progress Tracker Timeline */}
        <div className="max-w-7xl mx-auto px-4 mt-6 sm:px-6 lg:px-8">
          <SessionTrail currentStepKey={currentStepKey === 'wishlist' ? 'browse' : currentStepKey} />
        </div>

        {/* Dynamic Main Workspace Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          
          {currentStepKey === 'browse' && (
            <>
              {/* Premium Hero Banner Section */}
              <Hero onShopNow={() => {
                setCurrentStepKey('product_detail');
                logTransition('hero_cta_explore_click');
              }} />

              {/* Categorization Selection Tags Grid */}
              <div className="space-y-4">
                <h2 className="text-lg font-serif font-bold tracking-wide">Shop by Category</h2>
                <CategoryTiles 
                  activeCategory={activeCategory} 
                  onSelectCategory={(cat) => {
                    setActiveCategory(cat);
                    logTransition('filter_category_change', { targetCategory: cat });
                  }} 
                />
              </div>

              {/* Products Dynamic Catalog Grid Showcase */}
              <div className="space-y-6">
                <h2 className="text-xl font-serif font-bold tracking-tight text-stone-800">
                  {activeCategory === 'All' ? 'Popular Products' : `${activeCategory} Collection`}
                </h2>
                {filteredProducts.length === 0 ? (
                  <p className="text-sm text-stone-400 italic py-8">No items found matching this collection filter.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="group relative bg-white border border-stone-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                        
                        {/* Image Thumbnail Frame */}
                        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-100">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <ProductArt art={product.art} accent={product.accent} image={product.image} aspect="square" />
                          )}
                          <button 
                            type="button"
                            onClick={() => toggleWishlist(product.id)}
                            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-xs rounded-full shadow-sm text-stone-500 hover:text-orange transition-colors"
                          >
                            <Heart size={16} fill={wishlist.includes(product.id) ? '#ea580c' : 'none'} className={wishlist.includes(product.id) ? 'text-orange' : ''} />
                          </button>
                        </div>

                        {/* Detail Data Layout */}
                        <div className="mt-4 space-y-1">
                          <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">{product.category}</p>
                          <h3 className="text-sm font-medium text-stone-800 truncate">{product.name}</h3>
                          
                          <div className="flex items-center gap-1 text-orange pt-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={11} fill={i < Math.floor(product.rating || 4.7) ? 'currentColor' : 'none'} />
                            ))}
                            <span className="text-[10px] text-stone-400 font-medium ml-1">{product.rating || '4.7'}</span>
                          </div>
                          
                          <p className="text-sm font-semibold text-stone-900 pt-1">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}
                          </p>
                        </div>

                        <button 
                          type="button" 
                          onClick={() => {
                            setSelectedProduct(product);
                            setCurrentStepKey('product_detail');
                            logTransition('select_product_card_click', { productId: product.id });
                          }}
                          className="w-full mt-4 py-2.5 bg-orange text-white text-xs font-semibold rounded-xl hover:bg-orange/90 active:scale-[0.98] transition-all"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Product Detail Simulation View */}
          {currentStepKey === 'product_detail' && (
            <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-10 shadow-sm max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square bg-stone-50 rounded-xl overflow-hidden border border-stone-100">
                {selectedProduct?.image ? (
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                ) : (
                  <ProductArt 
                    art={selectedProduct?.art || PRODUCTS[0].art} 
                    accent={selectedProduct?.accent || PRODUCTS[0].accent} 
                    image={selectedProduct?.image || PRODUCTS[0].image} 
                    aspect="square" 
                  />
                )}
              </div>

              <div className="flex flex-col justify-between space-y-6">
                <div>
                  <button 
                    type="button" 
                    onClick={() => {
                      setCurrentStepKey('browse');
                      logTransition('detail_back_to_browse');
                    }}
                    className="text-xs text-stone-400 hover:text-stone-700 font-medium mb-3 inline-block"
                  >
                    ← Back to catalog
                  </button>
                  <h1 className="text-2xl font-serif font-bold text-stone-900">{selectedProduct?.name || PRODUCTS[0].name}</h1>
                  <p className="text-xs text-orange font-semibold tracking-wider uppercase mt-1">{selectedProduct?.category || PRODUCTS[0].category}</p>
                  <p className="text-xl font-bold text-stone-900 mt-4">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(selectedProduct?.price || PRODUCTS[0].price)}
                  </p>
                  <p className="text-sm text-stone-500 leading-relaxed mt-4">
                    Meticulously engineered luxury items crafted from genuine high-grade raw components, built intentionally to adapt into standard timeless rotations.
                  </p>
                </div>

                <div className="space-y-3">
                  <button 
                    type="button"
                    onClick={() => addToCart(selectedProduct || PRODUCTS[0])}
                    className="w-full py-3 bg-navy text-white text-sm font-semibold rounded-xl hover:bg-navy/95 active:scale-[0.99] transition-all shadow-md shadow-navy/10"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Wishlist View Screen Panel */}
          {currentStepKey === 'wishlist' && (
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-lg font-serif font-bold">Your Wishlist ({wishlistItems.length})</h2>
                <button type="button" onClick={() => setCurrentStepKey('browse')} className="text-xs text-orange font-semibold hover:underline">Continue Shopping</button>
              </div>
              
              {wishlistItems.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Heart size={32} className="text-stone-300 mx-auto stroke-[1.5]" />
                  <p className="text-sm text-stone-400">Your wishlist is currently empty.</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-4 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                          {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <ProductArt art={item.art} accent={item.accent} image={item.image} aspect="square" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-stone-800">{item.name}</h4>
                          <p className="text-[11px] text-stone-400 font-semibold uppercase">{item.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => addToCart(item)} className="p-2 bg-orange text-white text-xs font-medium rounded-lg hover:bg-orange/90 flex items-center gap-1"><ShoppingBag size={13} /> Add to Bag</button>
                        <button type="button" onClick={() => toggleWishlist(item.id)} className="p-2 text-stone-400 hover:text-red-500 rounded-lg"><Trash2 size={15} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cart View State Section */}
          {currentStepKey === 'cart' && (
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm max-w-2xl mx-auto space-y-6">
              <h2 className="text-lg font-serif font-bold border-b pb-3">Shopping Bag ({cart.length})</h2>
              {cart.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <p className="text-sm text-stone-400">Your shopping bag is currently empty.</p>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-stone-100">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                            {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <ProductArt art={item.art} accent={item.accent} image={item.image} aspect="square" />}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-stone-800">{item.name}</h4>
                            <p className="text-[11px] text-stone-400">{item.category}</p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-stone-900">
                          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold text-stone-950">
                      <span>Total Balance:</span>
                      <span>
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(cart.reduce((sum, item) => sum + item.price, 0))}
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => {
                        setCurrentStepKey('checkout');
                        logTransition('checkout_funnel_initiate', { totalAmount: cart.reduce((sum, item) => sum + item.price, 0) });
                      }}
                      className="w-full py-3 bg-orange text-white text-sm font-semibold rounded-xl hover:bg-orange/90 transition-all"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Checkout Final Order Simulation Section */}
          {currentStepKey === 'checkout' && (
            <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm max-w-md mx-auto text-center space-y-5">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto text-xl font-bold">✓</div>
              <h2 className="text-xl font-serif font-bold text-stone-900">Order Placed Successfully!</h2>
              <button 
                type="button"
                onClick={() => {
                  setCart([]);
                  setCurrentStepKey('browse');
                  logTransition('order_success_funnel_reset');
                }}
                className="w-full py-2.5 bg-navy text-white text-xs font-semibold rounded-xl hover:bg-navy/90"
              >
                Continue Shopping
              </button>
            </div>
          )}

        </main>
      </div>

      {/* Floating Interactive Analytics Logs Console Window */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
        {showLogsPanel && (
          <div className="w-80 h-96 bg-stone-950 border border-stone-800 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden backdrop-blur-md">
            <div className="bg-stone-900/80 px-4 py-2.5 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange text-xs font-mono font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                TELEMETRY_LOGS_STREAM
              </div>
              <button onClick={() => setShowLogsPanel(false)} className="text-stone-500 hover:text-white transition-colors">
                <EyeOff size={14} />
              </button>
            </div>
            
            <div className="flex-1 p-3 font-mono text-[10px] text-stone-400 overflow-y-auto space-y-2 select-text custom-scrollbar">
              {simulatedLogs.length === 0 ? (
                <p className="text-stone-600 italic text-center pt-36">Waiting for user interaction events...</p>
              ) : (
                simulatedLogs.map((log) => (
                  <div key={log.id} className="p-2 rounded bg-white/5 border border-white/5 space-y-0.5">
                    <p className="text-emerald-400 font-semibold">[{log.time}] EVT_{log.action.toUpperCase()}</p>
                    <p className="text-stone-500 text-[9px]">STEP: <span className="text-white">{log.step}</span></p>
                    {log.targetCategory && <p className="text-stone-500 text-[9px]">TARGET: <span className="text-sky-400">{log.targetCategory}</span></p>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowLogsPanel(!showLogsPanel)}
          className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full shadow-xl border border-white/15 transition-all font-mono text-xs font-medium tracking-wide"
        >
          <Terminal size={14} className={showLogsPanel ? 'text-orange' : 'text-emerald-400'} />
          {showLogsPanel ? 'Close Stream View' : 'Inspect Funnel Logs'}
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-stone-200/60 bg-transparent py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-sans tracking-widest uppercase text-stone-500">
            <a href="#care" className="hover:text-stone-800 transition-colors">Customer Care</a>
            <a href="#shipping" className="hover:text-stone-800 transition-colors">Shipping & Returns</a>
            <a href="#privacy" className="hover:text-stone-800 transition-colors">Privacy Policy</a>
          </div>
          <div className="w-16 h-[1px] bg-stone-300 my-1 rounded-full" />
          <p className="text-center text-[10px] font-sans tracking-widest text-stone-400 uppercase">
            © 2026 AURELLE — Crafted Essentials. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}