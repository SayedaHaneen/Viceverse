import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  ArrowLeft, 
  Download, 
  Key, 
  PackageCheck,
  Clock
} from 'lucide-react';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('cart'); // 'cart' or 'orders'
  const [pastOrders, setPastOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  // Load past user orders for instant asset re-downloads
  useEffect(() => {
    async function loadOrders() {
      if (!isAuthenticated) return;
      setLoadingOrders(true);
      try {
        const res = await api.getMyOrders();
        if (res.success && res.orders) {
          setPastOrders(res.orders);
        }
      } catch (err) {
        console.warn('Could not load past orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    }

    loadOrders();
  }, [isAuthenticated]);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'VICE20') {
      setDiscountPercent(20);
      setPromoMessage('Promo code VICE20 applied: 20% OFF!');
    } else {
      setDiscountPercent(0);
      setPromoMessage('Invalid promo code. Try "VICE20"');
    }
  };

  const discountAmount = (cart.subtotal * discountPercent) / 100;
  const grandTotal = Math.max(0, cart.subtotal - discountAmount);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      
      {/* HEADER */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="font-anton text-4xl uppercase tracking-wide text-white">
            LOOT CART & <span className="gradient-text-vice">DOWNLOADS</span>
          </h1>
          <p className="text-xs text-[#A3A9BA] mt-1">
            Manage your digital cart items or download your purchased asset packages.
          </p>
        </div>

        {/* TABS: CART vs DOWNLOADS */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('cart')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'cart'
                ? 'bg-gradient-to-r from-[#FF4FA3] to-[#FF8642] text-white shadow-neon-pink'
                : 'bg-[#151B2B] text-[#A3A9BA] hover:text-white'
            }`}
          >
            Shopping Bag ({cart.itemCount})
          </button>

          {isAuthenticated && (
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-[#35DDF5] to-[#A855F7] text-white shadow-neon-cyan'
                  : 'bg-[#151B2B] text-[#A3A9BA] hover:text-white'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Purchased Downloads ({pastOrders.length})</span>
            </button>
          )}

          <Link
            to="/marketplace"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase text-[#35DDF5] hover:underline ml-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Marketplace
          </Link>
        </div>
      </div>

      {/* ========================================================
          TAB 1: SHOPPING CART
      ======================================================== */}
      {activeTab === 'cart' && (
        <>
          {cart.items.length === 0 ? (
            <div className="py-24 text-center rounded-3xl bg-[#101421] border border-white/10 p-8 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-[#151B2B] flex items-center justify-center text-white/30 mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-anton text-2xl uppercase text-white mb-2">Your Cart is Empty</h3>
              <p className="text-xs text-[#A3A9BA] mb-6">
                Explore 8K wallpapers, animated overlays and thumbnail packs in the marketplace.
              </p>
              <Link
                to="/marketplace"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#FF8642] text-white font-bold text-xs uppercase tracking-wider shadow-neon-pink inline-block"
              >
                Explore Marketplace
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* ITEMS LIST (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex justify-between items-center px-2">
                  <span className="text-xs text-[#A3A9BA] uppercase font-bold tracking-wider">
                    {cart.itemCount} Items in Loot Bag
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-xs text-red-400 hover:underline font-semibold"
                  >
                    Clear Cart
                  </button>
                </div>

                {cart.items.map((item) => (
                  <div
                    key={item.cart_item_id}
                    className="p-5 rounded-2xl bg-gradient-to-br from-[#181226]/90 to-[#101421]/95 border border-white/10 hover:border-[#FF4FA3]/40 transition-all flex flex-col sm:flex-row items-center gap-5 justify-between shadow-lg"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={item.preview_image}
                        alt={item.title}
                        className="w-20 h-20 rounded-xl object-cover bg-[#080A12] shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-[#35DDF5] uppercase">
                          {item.category_name || 'Digital Asset'}
                        </span>
                        <h3 className="font-anton text-lg uppercase text-white leading-tight">
                          {item.title}
                        </h3>
                        <span className="text-xs text-[#A3A9BA] block mt-0.5">
                          by @{item.seller_username} • {item.file_type || 'ZIP'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                      <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-[#151B2B]">
                        <button
                          onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs text-white/60 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs text-white/60 hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-mono text-lg font-bold text-white">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>

                      <button
                        onClick={() => removeFromCart(item.cart_item_id)}
                        className="p-2 text-white/40 hover:text-red-400"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* SUMMARY CARD (4 cols) */}
              <div className="lg:col-span-4">
                <div className="p-6 rounded-3xl bg-[#101421] border border-white/10 space-y-6">
                  <h3 className="font-anton text-xl uppercase tracking-wider text-white">
                    Order Summary
                  </h3>

                  {/* Promo code */}
                  <form onSubmit={handleApplyPromo} className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-white/40 absolute left-3 top-3" />
                        <input
                          type="text"
                          placeholder="Promo code (VICE20)"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#151B2B] border border-white/10 text-xs text-white uppercase placeholder-white/30 focus:outline-none focus:border-[#FF4FA3]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white uppercase"
                      >
                        Apply
                      </button>
                    </div>
                    {promoMessage && (
                      <p className={`text-[11px] font-semibold ${discountPercent > 0 ? 'text-[#35DDF5]' : 'text-red-400'}`}>
                        {promoMessage}
                      </p>
                    )}
                  </form>

                  {/* Calculation list */}
                  <div className="space-y-2 text-xs border-t border-white/10 pt-4">
                    <div className="flex justify-between text-[#A3A9BA]">
                      <span>Subtotal</span>
                      <span className="font-mono text-white">${cart.subtotal.toFixed(2)}</span>
                    </div>
                    {discountPercent > 0 && (
                  <div className="flex justify-between text-[#35DDF5]">
                    <span>Discount (VICE20 - 20%)</span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                    <div className="flex justify-between text-[#A3A9BA]">
                      <span>Instant Delivery & Encryption</span>
                      <span className="text-[#35DDF5] font-semibold">FREE</span>
                    </div>
                    <div className="pt-3 border-t border-white/10 flex justify-between text-base font-bold text-white">
                      <span className="font-anton uppercase tracking-wider">Total</span>
                      <span className="font-mono text-2xl text-[#35DDF5] text-glow-cyan">
                        ${grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Proceed to checkout */}
                  <button
                    onClick={() => navigate('/checkout', { state: { promoCode: discountPercent > 0 ? 'VICE20' : '' } })}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF2A85] via-[#FF7582] to-[#FF8642] text-white font-anton text-lg uppercase tracking-wider shadow-[0_0_25px_rgba(255,42,133,0.6)] hover:shadow-[0_0_40px_rgba(255,42,133,0.95)] hover:scale-102 transition-all flex items-center justify-center gap-2 group active:scale-95"
                  >
                    <span>Proceed to Demo Checkout</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-[#A3A9BA]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#35DDF5]" />
                    <span>Simulated Sandbox Environment • No Real Money</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </>
      )}

      {/* ========================================================
          TAB 2: PURCHASED ASSETS & DOWNLOADS
      ======================================================== */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-anton text-2xl uppercase tracking-wider text-white">
              Your Purchased Assets & License Receipts
            </h2>
            <span className="text-xs text-[#A3A9BA]">
              {pastOrders.length} Completed Orders
            </span>
          </div>

          {pastOrders.length === 0 ? (
            <div className="py-20 text-center rounded-3xl bg-[#101421] border border-white/10 p-8">
              <PackageCheck className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <h4 className="font-anton text-xl uppercase text-white mb-2">No Past Orders Found</h4>
              <p className="text-xs text-[#A3A9BA] mb-6">
                Complete a demo order in the checkout to see your downloadable licenses and assets here.
              </p>
              <button
                onClick={() => setActiveTab('cart')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#35DDF5] to-[#A855F7] text-white font-bold text-xs uppercase"
              >
                Back to Cart
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {pastOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 rounded-3xl bg-[#101421] border border-white/10 space-y-4"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-[#35DDF5] text-sm">
                        {order.order_number}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold uppercase text-[10px]">
                        {order.status || 'Completed'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-[#A3A9BA]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                      <span>Total: <strong className="text-white font-mono">${Number(order.total_amount).toFixed(2)}</strong></span>
                    </div>
                  </div>

                  {/* Items in this order */}
                  <div className="space-y-3">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#151B2B] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5 w-full sm:w-auto">
                          <img
                            src={item.preview_image}
                            alt={item.title}
                            className="w-14 h-14 rounded-xl object-cover bg-black shrink-0"
                          />
                          <div>
                            <h4 className="font-anton text-base uppercase text-white truncate max-w-sm">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-1.5 text-xs font-mono text-[#35DDF5] mt-0.5">
                              <Key className="w-3 h-3 text-[#FF4FA3]" />
                              <span>{item.download_key || item.downloadKey}</span>
                            </div>
                          </div>
                        </div>

                        {/* DOWNLOAD ASSET BUTTON */}
                        <a
                          href={`/api/orders/download/${item.download_key || item.downloadKey}`}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#FF8642] text-white font-bold text-xs uppercase tracking-wider shadow-neon-pink hover:shadow-[0_0_25px_rgba(255,79,163,0.8)] flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download Asset Package</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
