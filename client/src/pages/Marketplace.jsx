import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Search, Store, SlidersHorizontal, Sparkles, Filter } from 'lucide-react';

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sort, setSort] = useState('featured');
  const [priceFilter, setPriceFilter] = useState('all');

  // Sync category if URL search params change
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.getCategories();
        if (res.success) setCategories(res.categories);
      } catch (e) {
        console.error('Error loading categories:', e);
      }
    }
    loadCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const queryParams = {
          search: search.trim() || undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          sort: sort || undefined,
        };

        if (priceFilter === 'under20') {
          queryParams.maxPrice = 20;
        } else if (priceFilter === '20to35') {
          queryParams.minPrice = 20;
          queryParams.maxPrice = 35;
        } else if (priceFilter === 'above35') {
          queryParams.minPrice = 35;
        }

        const res = await api.getProducts(queryParams);

        if (res.success) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, sort, priceFilter]);

  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen text-white pb-24">
      
      {/* ========================================================
          CINEMATIC BANNER HEADER (VICE CITY ASSET VAULT)
      ======================================================== */}
      <div 
        className="relative py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(8,10,18,0.78), rgba(8,10,18,0.96)), url('/assets/gta6/gta6-hero-sunset.jpg')`
        }}
      >
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF2A85]/20 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#35DDF5]/15 blur-[130px] pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A0B20]/90 border border-[#FF4FA3]/40 text-[#FFE2EC] text-xs font-bold uppercase tracking-[0.2em] mb-4 shadow-[0_0_20px_rgba(255,42,133,0.3)]">
              <Store className="w-3.5 h-3.5 text-[#FF4FA3]" /> Curated Digital Asset Vault
            </div>
            <h1 className="font-anton text-4xl sm:text-5xl lg:text-7xl uppercase tracking-wide text-white leading-none">
              DIGITAL <span className="gta6-gradient-text">MARKETPLACE</span>
            </h1>
            <p className="text-sm sm:text-base text-white/80 mt-3 max-w-2xl leading-relaxed font-normal">
              Acquire verified 8K wallpapers, animated OBS stream overlays, Twitch stinger alerts, and YouTube thumbnail packs designed by elite ViceVerse creators.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-5 py-3 rounded-2xl bg-[#121626]/90 border border-white/15 text-xs font-semibold text-white/90 flex items-center gap-2.5 backdrop-blur-md shadow-xl">
              <Sparkles className="w-4 h-4 text-[#FF4FA3]" />
              <span><strong>{products.length}</strong> Premium Drops Available</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {/* ========================================================
            FILTER CONTROLS TOOLBAR
        ======================================================== */}
        <div className="space-y-4 mb-10 p-5 rounded-2xl bg-[#121626]/80 border border-white/10 backdrop-blur-md">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by title, tags or format (e.g. 8K, OBS, PSD)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#181E32] border border-white/10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FF4FA3] transition-all shadow-inner"
              />
            </div>

            {/* Sort Selector */}
            <div className="md:w-56">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-[#181E32] border border-white/10 text-sm text-white focus:outline-none focus:border-[#FF4FA3] cursor-pointer"
              >
                <option value="featured">Featured / Best Match</option>
                <option value="sales">Best Selling Drops</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="md:w-48">
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-[#181E32] border border-white/10 text-sm text-white focus:outline-none focus:border-[#FF4FA3] cursor-pointer"
              >
                <option value="all">Any Price</option>
                <option value="under20">Under $20</option>
                <option value="20to35">$20 to $35</option>
                <option value="above35">Above $35</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-[#FF4FA3] via-[#FF7582] to-[#FF8642] text-white shadow-neon-pink'
                  : 'bg-[#181E32] border border-white/10 text-[#A3A9BA] hover:text-white hover:border-white/20'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat.slug
                    ? 'bg-gradient-to-r from-[#FF4FA3] via-[#FF7582] to-[#FF8642] text-white shadow-neon-pink'
                    : 'bg-[#181E32] border border-white/10 text-[#A3A9BA] hover:text-white hover:border-white/20'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================
            PRODUCT GRID
        ======================================================== */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-[#151B2B] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center rounded-3xl bg-[#121626]/90 border border-white/10 p-8 max-w-lg mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[#181E32] flex items-center justify-center text-white/30 mx-auto mb-4">
              <Store className="w-8 h-8" />
            </div>
            <h3 className="font-anton text-2xl uppercase text-white mb-2">No Products Found</h3>
            <p className="text-xs text-[#A3A9BA] mb-6">
              We couldn't find any products matching your current filters. Try resetting or selecting another category.
            </p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('all'); setPriceFilter('all'); }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#FF8642] text-white font-anton text-sm uppercase tracking-wider shadow-neon-pink hover:scale-105 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
