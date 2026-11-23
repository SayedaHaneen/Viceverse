import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const discountPercent = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  return (
    <div className="group relative rounded-2xl bg-gradient-to-b from-[#181226]/90 to-[#101421]/95 border border-white/10 hover:border-[#35DDF5]/60 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-[0_16px_40px_-10px_rgba(53,221,245,0.4)] hover:-translate-y-1.5 backdrop-blur-md">
      
      {/* Top subtle neon accent line */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#35DDF5]/40 to-transparent group-hover:via-[#35DDF5] transition-all" />

      {/* IMAGE PREVIEW */}
      <Link to={`/product/${product.slug}`} className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A0D18] block">
        <img
          src={product.preview_image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 filter brightness-95 group-hover:brightness-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101421] via-transparent to-black/30" />

        {/* Category Badge */}
        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-[#35DDF5]/30 text-[10px] font-bold text-[#35DDF5] uppercase tracking-wider shadow-sm">
          {product.category_name || 'Digital Asset'}
        </span>

        {/* Discount Badge */}
        {discountPercent && (
          <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-[#FF2A85] to-[#FF8642] text-[10px] font-black text-white uppercase tracking-wider shadow-[0_0_15px_rgba(255,42,133,0.6)]">
            -{discountPercent}%
          </span>
        )}

        {/* File Type Pill */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm border border-white/10 text-[10px] text-white/90 font-mono">
          {product.file_type || 'ZIP'}
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* SELLER ATTRIBUTION */}
          <div className="flex items-center gap-2 mb-2">
            <img
              src={product.seller_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={product.seller_username}
              className="w-4 h-4 rounded-full object-cover ring-1 ring-white/20"
            />
            <span className="text-[11px] text-[#A3A9BA]">
              by{' '}
              <Link
                to={`/creator/${product.seller_username}`}
                className="text-white hover:text-[#FF4FA3] font-semibold transition-colors"
              >
                @{product.seller_username}
              </Link>
            </span>
          </div>

          {/* TITLE */}
          <Link
            to={`/product/${product.slug}`}
            className="font-anton text-lg tracking-wide text-white group-hover:text-[#35DDF5] transition-colors line-clamp-1 uppercase mb-1.5 block"
          >
            {product.title}
          </Link>

          {/* RATING */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-white">{Number(product.rating || 5.0).toFixed(1)}</span>
            <span className="text-[11px] text-[#A3A9BA]">({product.sales_count || 120}+ drops)</span>
          </div>
        </div>

        {/* PRICE & ADD TO CART */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-white font-mono">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xs text-[#A3A9BA] line-through font-mono">
                  ${Number(product.original_price).toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#35DDF5] font-semibold tracking-wide flex items-center gap-1 mt-0.5">
              <Zap className="w-2.5 h-2.5" /> Instant Delivery
            </span>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="p-3 rounded-xl bg-white/10 hover:bg-gradient-to-r hover:from-[#FF2A85] hover:to-[#FF8642] text-white hover:shadow-[0_0_20px_rgba(255,42,133,0.7)] transition-all duration-200 active:scale-95 group/btn"
            title="Add to Loot Cart"
          >
            <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}