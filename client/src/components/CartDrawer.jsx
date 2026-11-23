import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Tag, ShieldCheck } from 'lucide-react';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  if (!isCartOpen) return null;

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

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout', { state: { promoCode: discountPercent > 0 ? 'VICE20' : '' } });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#101421] border-l border-white/10 shadow-2xl flex flex-col">
          
          {/* HEADER */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#FF4FA3]/15 text-[#FF4FA3]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-anton text-xl tracking-wider text-white uppercase">
                  Your Loot Cart
                </h3>
                <span className="text-xs text-[#A3A9BA]">
                  {cart.itemCount} {cart.itemCount === 1 ? 'digital item' : 'digital items'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* CART ITEMS LIST */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#A3A9BA]">
                <div className="w-16 h-16 rounded-2xl bg-[#151B2B] border border-white/10 flex items-center justify-center text-white/30 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-anton text-lg tracking-wide text-white uppercase mb-1">
                  Your cart is empty
                </h4>
                <p className="text-xs text-[#A3A9BA] max-w-xs mb-6">
                  Explore high-definition 8K wallpapers, animated stream packs and thumbnail kits in the marketplace.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/marketplace');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#FF9B61] text-white font-bold text-xs uppercase tracking-wider shadow-neon-pink"
                >
                  Browse Marketplace
                </button>
              </div>
            ) : (
              cart.items.map((item) => (
                <div
                  key={item.cart_item_id}
                  className="p-3.5 rounded-2xl bg-[#151B2B] border border-white/5 flex gap-3.5 items-center"
                >
                  <img
                    src={item.preview_image}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover bg-[#080A12] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-anton text-sm uppercase text-white truncate mb-0.5">
                      {item.title}
                    </h5>
                    <div className="text-[11px] text-[#A3A9BA] truncate mb-2">
                      by @{item.seller_username || 'creator'} • {item.file_type || 'Digital Pack'}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-[#101421]">
                        <button
                          onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-white/60 hover:text-white hover:bg-white/5"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-white/60 hover:text-white hover:bg-white/5"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-mono font-bold text-[#35DDF5]">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.cart_item_id)}
                    className="p-2 text-white/40 hover:text-red-400 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* FOOTER & TOTALS */}
          {cart.items.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-[#0C101A] space-y-4">
              
              {/* Promo code */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-white/40 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Promo code (e.g. VICE20)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#151B2B] border border-white/10 text-xs text-white uppercase placeholder-white/30 focus:outline-none focus:border-[#FF4FA3]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
                >
                  Apply
                </button>
              </form>

              {promoMessage && (
                <p className={`text-[11px] font-semibold ${discountPercent > 0 ? 'text-[#35DDF5]' : 'text-red-400'}`}>
                  {promoMessage}
                </p>
              )}

              {/* Summary calculations */}
              <div className="space-y-1.5 text-xs">
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
                  <span>Digital Delivery & Licensing</span>
                  <span className="text-[#35DDF5] font-semibold uppercase text-[10px]">Instant ($0.00)</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-base font-bold text-white">
                  <span className="font-anton uppercase tracking-wide">Total</span>
                  <span className="font-mono text-xl text-[#35DDF5] text-glow-cyan">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF2A85] via-[#FF7582] to-[#FF8642] text-white font-anton text-base uppercase tracking-wider shadow-[0_0_20px_rgba(255,42,133,0.6)] hover:shadow-[0_0_35px_rgba(255,42,133,0.9)] hover:scale-102 transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
              >
                <span>Proceed to Demo Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#A3A9BA]/80">
                <ShieldCheck className="w-3.5 h-3.5 text-[#35DDF5]" />
                <span>Simulated Sandbox Checkout • 100% Free Demo Orders</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
