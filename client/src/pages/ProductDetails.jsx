import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { 
  ShoppingBag, 
  Star, 
  Zap, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft,
  FileCheck,
  HardDrive,
  Clock,
  Heart
} from 'lucide-react';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await api.getProduct(slug);
        if (res.success && res.product) {
          setProduct(res.product);
          setActiveImage(res.product.preview_image);
          setRelatedProducts(res.relatedProducts || []);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleInstantBuy = async () => {
    await addToCart(product, 1);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen py-24 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#35DDF5]/30 border-t-[#35DDF5] rounded-full animate-spin mb-4" />
        <p className="font-bebas text-lg tracking-wider uppercase text-white/70">
          Loading Product Specifications...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-24 px-4 text-center max-w-md mx-auto">
        <h2 className="font-anton text-3xl uppercase text-white mb-2">Product Not Found</h2>
        <p className="text-sm text-[#A3A9BA] mb-6">
          This digital item may have been archived or removed by its creator.
        </p>
        <Link
          to="/marketplace"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#FF9B61] text-white font-bold text-xs uppercase"
        >
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const discountPercent = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const gallery = Array.isArray(product.thumbnail_images) && product.thumbnail_images.length > 0
    ? product.thumbnail_images
    : [product.preview_image];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white relative">
      
      {/* Ambient background glows */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-[#FF2A85]/15 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-60 left-10 w-96 h-96 bg-[#35DDF5]/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Back button */}
      <div className="mb-8 relative z-10">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#121626]/80 hover:bg-[#1A1F36] border border-white/10 text-xs font-bold uppercase tracking-wider text-[#A3A9BA] hover:text-white transition-all shadow-md group"
        >
          <ArrowLeft className="w-4 h-4 text-[#35DDF5] group-hover:-translate-x-1 transition-transform" />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      {/* MAIN PRODUCT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20 relative z-10">
        
        {/* LEFT COLUMN: PREVIEWS & GALLERY (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-[#0A0D18] border border-white/15 shadow-2xl group">
            <img
              src={activeImage}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D18] via-transparent to-black/30 pointer-events-none" />

            {discountPercent && (
              <span className="absolute top-4 right-4 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF2A85] to-[#FF8642] text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(255,42,133,0.7)]">
                Save {discountPercent}%
              </span>
            )}

            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white/90">
              Format: {product.file_type || 'ZIP Archive'} • {product.file_size_mb} MB
            </div>
          </div>

          {/* Thumbnails list */}
          {gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {gallery.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(thumb)}
                  className={`w-24 h-18 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === thumb ? 'border-[#35DDF5] scale-105 shadow-[0_0_15px_rgba(53,221,245,0.6)]' : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
                  }`}
                >
                  <img src={thumb} alt={`preview ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: DETAILS & ACTIONS (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Category & Status */}
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-lg bg-[#35DDF5]/15 border border-[#35DDF5]/40 text-xs font-bold text-[#35DDF5] uppercase tracking-wider">
                {product.category_name}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FF2A85]/15 border border-[#FF2A85]/30 text-xs text-[#FF4FA3] font-bold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-[#FF4FA3]" /> Instant Download
              </span>
            </div>

            {/* Title */}
            <h1 className="font-anton text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wide text-white leading-tight">
              {product.title}
            </h1>

            {/* Seller attribution card */}
            <Link
              to={`/creator/${product.seller_username}`}
              className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#121626]/90 border border-white/10 hover:border-[#FF4FA3]/50 transition-all group backdrop-blur-md shadow-lg"
            >
              <img
                src={product.seller_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={product.seller_username}
                className="w-12 h-12 rounded-xl object-cover border-2 border-white/10 group-hover:border-[#FF4FA3] transition-colors"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white group-hover:text-[#35DDF5] transition-colors truncate">
                    {product.seller_display_name || product.seller_name}
                  </span>
                  {product.seller_verified && (
                    <CheckCircle2 className="w-4 h-4 text-[#35DDF5]" />
                  )}
                </div>
                <span className="text-xs text-[#FF4FA3] font-mono">@{product.seller_username}</span>
              </div>
              <span className="text-xs font-semibold text-[#A3A9BA] group-hover:text-white flex items-center gap-1">
                View Profile &rarr;
              </span>
            </Link>

            {/* Price Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#181226] to-[#121626] border border-white/10 flex items-center justify-between shadow-xl">
              <div>
                <span className="text-xs uppercase font-extrabold text-[#A3A9BA] tracking-wider block mb-1">
                  Verified Creator Asset
                </span>
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-4xl font-black text-white">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  {product.original_price && (
                    <span className="font-mono text-lg text-[#A3A9BA] line-through">
                      ${Number(product.original_price).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1.5 text-amber-400 justify-end mb-1">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-base font-bold text-white">{Number(product.rating || 5.0).toFixed(1)}</span>
                </div>
                <span className="text-[11px] text-[#A3A9BA]">
                  {product.sales_count || 100}+ drops sold
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
              <button
                onClick={() => addToCart(product, 1)}
                className="flex-1 py-4 rounded-xl bg-[#181E32] hover:bg-[#202842] border border-white/15 hover:border-[#35DDF5] text-white font-anton text-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
              >
                <ShoppingBag className="w-5 h-5 text-[#35DDF5]" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleInstantBuy}
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#FF2A85] via-[#FF7582] to-[#FF8642] text-white font-anton text-lg uppercase tracking-wider shadow-[0_0_30px_rgba(255,42,133,0.7)] hover:shadow-[0_0_45px_rgba(255,42,133,0.95)] hover:scale-102 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Zap className="w-5 h-5 fill-white" />
                <span>Instant Buy</span>
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10 text-xs text-[#A3A9BA]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#35DDF5]" />
                <span>Verified Clean Files</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-[#FF4FA3]" />
                <span>Unlimited Re-download</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#FF9B61]" />
                <span>Commercial Twitch License</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>OBS & Premiere Ready</span>
              </div>
            </div>
          </div>

          {/* Specifications table */}
          <div className="p-6 rounded-2xl bg-[#121626]/90 border border-white/10 space-y-3 text-xs backdrop-blur-md shadow-lg">
            <h4 className="font-anton text-base uppercase text-white tracking-wider mb-2">
              Technical Specifications
            </h4>
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-[#A3A9BA]">Format / File Type</span>
              <span className="text-white font-mono font-semibold">{product.file_type || 'ZIP Archive'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-[#A3A9BA]">Download Size</span>
              <span className="text-white font-mono font-semibold">{product.file_size_mb} MB</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-[#A3A9BA]">Resolution Quality</span>
              <span className="text-[#35DDF5] font-semibold">4K / 8K Master Grade</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[#A3A9BA]">Tags</span>
              <span className="text-white/80">{product.tags || 'GTA VI, Neon, Synthwave'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* DESCRIPTION BLOCK */}
      <div className="mb-20 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#14192B] to-[#101421] border border-white/10 space-y-4 shadow-xl relative z-10">
        <h3 className="font-anton text-2xl sm:text-3xl uppercase text-white tracking-wide">
          Product Overview & Features
        </h3>
        <p className="text-sm sm:text-base text-[#A3A9BA] leading-relaxed whitespace-pre-line max-w-4xl">
          {product.description}
        </p>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8 relative z-10">
          <div className="flex items-center justify-between">
            <h3 className="font-anton text-3xl uppercase text-white tracking-wide">
              More from <span className="gradient-text-vice">{product.category_name}</span>
            </h3>
            <Link
              to={`/marketplace?category=${product.category_slug}`}
              className="text-xs font-bold uppercase text-[#35DDF5] hover:text-white transition-colors"
            >
              View Category &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
