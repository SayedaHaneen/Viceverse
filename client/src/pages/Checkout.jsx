import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ShoppingBag, 
  Download, 
  CreditCard, 
  Coins, 
  Zap, 
  Sparkles, 
  ArrowLeft,
  Key,
  Check
} from 'lucide-react';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [customerName, setCustomerName] = useState(user?.full_name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [gamerTag, setGamerTag] = useState(user?.username || 'LeonidaGamer');
  const [paymentMethod, setPaymentMethod] = useState('demo_vice_credits');
  const [promoCode, setPromoCode] = useState(location.state?.promoCode || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.full_name);
      if (!customerEmail) setCustomerEmail(user.email);
      if (!gamerTag) setGamerTag(user.username);
    }
  }, [user]);

  // Price calculations
  const rawSubtotal = cart.subtotal;
  const isPromoApplied = promoCode.trim().toUpperCase() === 'VICE20';
  const discountAmount = isPromoApplied ? rawSubtotal * 0.20 : 0;
  const totalAmount = Math.max(0, rawSubtotal - discountAmount);

  // Submit Demo Order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!customerName || !customerEmail) {
      addToast('Please enter your name and email.', 'error');
      return;
    }

    if (cart.items.length === 0) {
      addToast('Your cart is empty.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customer_name: customerName,
        customer_email: customerEmail,
        payment_method: paymentMethod,
        promo_code: isPromoApplied ? 'VICE20' : '',
        items: cart.items,
      };

      const res = await api.createDemoOrder(payload);
      if (res.success && res.order) {
        setCompletedOrder(res.order);
        clearCart();
        addToast('Demo order successfully placed and saved to database!', 'success');
      }
    } catch (err) {
      console.error('Order checkout error:', err);
      addToast(err.message || 'Failed to place demo order.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order is completed, show Order Confirmation Screen!
  if (completedOrder) {
    return (
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-white">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#101421] border border-[#35DDF5]/40 shadow-[0_0_50px_rgba(53,221,245,0.2)] text-center">
          
          {/* Neon check badge */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#35DDF5] to-[#A855F7] p-1 mx-auto mb-6 shadow-neon-cyan flex items-center justify-center animate-bounce">
            <div className="w-full h-full bg-[#080A12] rounded-full flex items-center justify-center">
              <Check className="w-10 h-10 text-[#35DDF5]" />
            </div>
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-[#35DDF5]/15 border border-[#35DDF5]/40 text-[#35DDF5] text-xs font-bold uppercase tracking-widest mb-3">
            Simulated Order Confirmed & Stored in DB
          </span>

          <h1 className="font-anton text-4xl sm:text-5xl uppercase tracking-wide text-white mb-2">
            THANK YOU FOR YOUR ORDER!
          </h1>
          <p className="text-sm text-[#A3A9BA] max-w-md mx-auto mb-6 leading-relaxed">
            Your demo order has been authenticated and permanently recorded. Your high-resolution gaming assets are unlocked below.
          </p>

          {/* Order Details Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#151B2B] border border-white/10 max-w-2xl mx-auto mb-8 text-left text-xs">
            <div>
              <span className="text-[#A3A9BA] block">Order Number</span>
              <strong className="text-white font-mono text-sm">{completedOrder.orderNumber}</strong>
            </div>
            <div>
              <span className="text-[#A3A9BA] block">Recipient</span>
              <strong className="text-white truncate block">{completedOrder.customerName}</strong>
            </div>
            <div>
              <span className="text-[#A3A9BA] block">Total Amount</span>
              <strong className="text-[#35DDF5] font-mono text-sm">${completedOrder.total.toFixed(2)}</strong>
            </div>
            <div>
              <span className="text-[#A3A9BA] block">Payment Demo</span>
              <strong className="text-[#FF9B61] uppercase text-[11px] font-bold">Vice Credits (Paid)</strong>
            </div>
          </div>

          {/* Unlocked Assets List with Download Keys */}
          <div className="text-left max-w-2xl mx-auto space-y-4 mb-10">
            <h3 className="font-anton text-lg uppercase tracking-wider text-white">
              Unlocked Digital Assets & License Keys
            </h3>

            {completedOrder.items?.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#151B2B] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <img
                    src={item.preview_image}
                    alt={item.title}
                    className="w-14 h-14 rounded-xl object-cover bg-black shrink-0"
                  />
                  <div>
                    <h4 className="font-anton text-sm uppercase text-white truncate max-w-xs">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#35DDF5] mt-0.5">
                      <Key className="w-3 h-3" />
                      <span>{item.downloadKey}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={`/api/orders/download/${item.downloadKey}`}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#FF8642] text-white font-bold text-xs uppercase tracking-wider shadow-neon-pink flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Asset</span>
                </a>
              </div>
            ))}
          </div>

          {/* Return CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/marketplace"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider"
            >
              Browse More Assets
            </Link>
            <Link
              to="/"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#35DDF5] to-[#A855F7] text-white font-bold text-xs uppercase tracking-wider shadow-neon-cyan"
            >
              Return Home
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      
      {/* DEMO NOTICE BANNER (PROMPT REQUIREMENT) */}
      <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-[#FF4FA3]/20 via-[#35DDF5]/20 to-[#FF9B61]/20 border border-[#35DDF5]/40 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#35DDF5] text-black">
            <ShieldCheck className="w-5 h-5 font-bold" />
          </div>
          <div>
            <h4 className="font-anton text-sm uppercase tracking-wider text-white">
              Demonstration Simulated Checkout Mode
            </h4>
            <p className="text-xs text-white/80">
              No real credit card, financial gateway or payment charge will occur. Orders are saved safely to MySQL for project grading and testing.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-black/50 text-[10px] font-bold text-[#35DDF5] uppercase border border-white/10">
          Sandbox Safe
        </span>
      </div>

      <div className="mb-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A3A9BA] hover:text-[#FF4FA3]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
        <h1 className="font-anton text-4xl uppercase tracking-wide text-white mt-2">
          DEMO <span className="gradient-text-vice">CHECKOUT</span>
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: CUSTOMER & PAYMENT DETAILS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Customer Info Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#101421] border border-white/10 space-y-4">
            <h3 className="font-anton text-xl uppercase tracking-wider text-white">
              1. Customer & Streamer Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A3A9BA] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#151B2B] border border-white/10 text-sm text-white focus:outline-none focus:border-[#FF4FA3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A3A9BA] mb-1.5">
                  Email for Asset Delivery
                </label>
                <input
                  type="email"
                  required
                  placeholder="player1@viceverse.gg"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#151B2B] border border-white/10 text-sm text-white focus:outline-none focus:border-[#FF4FA3]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A3A9BA] mb-1.5">
                  Gamer Handle / Twitch Username
                </label>
                <input
                  type="text"
                  placeholder="GamerTag"
                  value={gamerTag}
                  onChange={(e) => setGamerTag(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#151B2B] border border-white/10 text-sm text-white focus:outline-none focus:border-[#FF4FA3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A3A9BA] mb-1.5">
                  Leonida District
                </label>
                <input
                  type="text"
                  disabled
                  defaultValue="Ocean Beach, Vice City, FL"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#151B2B] border border-white/5 text-white/50 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#101421] border border-white/10 space-y-4">
            <h3 className="font-anton text-xl uppercase tracking-wider text-white">
              2. Select Simulated Payment Option
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1 */}
              <div
                onClick={() => setPaymentMethod('demo_vice_credits')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'demo_vice_credits'
                    ? 'bg-[#FF4FA3]/15 border-[#FF4FA3] shadow-neon-pink'
                    : 'bg-[#151B2B] border-white/10 hover:border-white/20'
                }`}
              >
                <Zap className="w-5 h-5 text-[#FF4FA3] mb-2" />
                <h4 className="font-anton text-sm uppercase text-white">Vice Credits</h4>
                <span className="text-[10px] text-[#A3A9BA] block mt-1">Instant Demo Free</span>
              </div>

              {/* Option 2 */}
              <div
                onClick={() => setPaymentMethod('demo_card')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'demo_card'
                    ? 'bg-[#35DDF5]/15 border-[#35DDF5] shadow-neon-cyan'
                    : 'bg-[#151B2B] border-white/10 hover:border-white/20'
                }`}
              >
                <CreditCard className="w-5 h-5 text-[#35DDF5] mb-2" />
                <h4 className="font-anton text-sm uppercase text-white">Neon Debit</h4>
                <span className="text-[10px] text-[#A3A9BA] block mt-1">Simulated Card</span>
              </div>

              {/* Option 3 */}
              <div
                onClick={() => setPaymentMethod('demo_crypto')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'demo_crypto'
                    ? 'bg-[#FF9B61]/15 border-[#FF9B61] shadow-neon-orange'
                    : 'bg-[#151B2B] border-white/10 hover:border-white/20'
                }`}
              >
                <Coins className="w-5 h-5 text-[#FF9B61] mb-2" />
                <h4 className="font-anton text-sm uppercase text-white">Cyber Crypto</h4>
                <span className="text-[10px] text-[#A3A9BA] block mt-1">Simulated SOL/BTC</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY & PLACE ORDER (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#101421] border border-white/10 space-y-6">
            <h3 className="font-anton text-xl uppercase tracking-wider text-white">
              Order Summary ({cart.itemCount} Items)
            </h3>

            {/* List of items */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <div key={item.cart_item_id} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.preview_image}
                    alt={item.title}
                    className="w-12 h-12 rounded-xl object-cover bg-black shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-anton uppercase text-white truncate">{item.title}</h5>
                    <span className="text-[#A3A9BA] block text-[11px]">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-mono font-bold text-white">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs border-t border-white/10 pt-4">
              <div className="flex justify-between text-[#A3A9BA]">
                <span>Subtotal</span>
                <span className="font-mono text-white">${rawSubtotal.toFixed(2)}</span>
              </div>
              {isPromoApplied && (
                <div className="flex justify-between text-[#35DDF5]">
                  <span>Discount (VICE20 - 20%)</span>
                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#A3A9BA]">
                <span>Licensing & Asset Delivery</span>
                <span className="text-[#35DDF5] font-semibold">INSTANT ($0.00)</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between text-base font-bold text-white">
                <span className="font-anton uppercase tracking-wider">Demo Total</span>
                <span className="font-mono text-2xl text-[#35DDF5] text-glow-cyan">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting || cart.items.length === 0}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF2A85] via-[#FF7582] to-[#FF8642] text-white font-anton text-lg uppercase tracking-wider shadow-[0_0_25px_rgba(255,42,133,0.6)] hover:shadow-[0_0_40px_rgba(255,42,133,0.95)] hover:scale-102 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>Place Demo Order (${totalAmount.toFixed(2)})</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-[#A3A9BA]/70 text-center leading-relaxed">
              By clicking "Place Demo Order", you confirm that this is a simulated academic project demonstration. Completed order records are saved directly in MySQL.
            </p>
          </div>
        </div>

      </form>

    </div>
  );
}
