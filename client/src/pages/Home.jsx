import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import CreatorCard from '../components/CreatorCard';
import ProductCard from '../components/ProductCard';
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Store, 
  Gamepad2, 
  Tv, 
  Monitor, 
  Image, 
  Film, 
  Layout, 
  Palette, 
  ShieldCheck, 
  Zap, 
  Flame,
  CheckCircle2
} from 'lucide-react';

export default function Home() {
  const [featuredCreators, setFeaturedCreators] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [creatorsRes, productsRes, categoriesRes] = await Promise.all([
          api.getCreators({ featured: 'true' }),
          api.getProducts({ trending: 'true' }),
          api.getCategories()
        ]);

        if (creatorsRes.success) setFeaturedCreators(creatorsRes.creators.slice(0, 4));
        if (productsRes.success) setTrendingProducts(productsRes.products.slice(0, 4));
        if (categoriesRes.success) setCategories(categoriesRes.categories);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Monitor': return <Monitor className="w-6 h-6 text-[#35DDF5]" />;
      case 'Image': return <Image className="w-6 h-6 text-[#FF4FA3]" />;
      case 'Tv': return <Tv className="w-6 h-6 text-[#FF9B61]" />;
      case 'Film': return <Film className="w-6 h-6 text-[#A855F7]" />;
      case 'Layout': return <Layout className="w-6 h-6 text-[#35DDF5]" />;
      case 'Palette': return <Palette className="w-6 h-6 text-[#FF4FA3]" />;
      default: return <Sparkles className="w-6 h-6 text-[#35DDF5]" />;
    }
  };

  return (
    <div className="min-h-screen text-white overflow-hidden">
      
      {/* ========================================================
          HERO SECTION (GTA VI / LEONIDA SUNSET SKYLINE AESTHETIC)
      ======================================================== */}
      <section className="relative min-h-[98vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-12 pb-28 overflow-hidden">
        
        {/* Authentic GTA 6 Skyline & Coastal Sunset Background (Zero Mountains) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none filter saturate-[1.4] contrast-[1.15]"
          style={{
            backgroundImage: `url('/assets/gta6/gta6-hero-sunset.jpg')`
          }}
        />

        {/* Seamless Cinematic Gradient Transitions into rest of page */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080A12] via-[#080A12]/40 to-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF2A85]/15 to-[#080A12] pointer-events-none" />
        
        {/* Ambient GTA 6 Sun & Sunset Bloom */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-gradient-to-b from-[#FFAA00]/25 via-[#FF2A85]/35 to-transparent blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute bottom-16 right-10 w-96 h-96 bg-[#35DDF5]/20 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-10 left-10 w-96 h-96 bg-[#FF4FA3]/25 blur-[120px] pointer-events-none rounded-full" />

        {/* Subtle Ambient Floating Neon Dust Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[25%] left-[18%] w-2.5 h-2.5 rounded-full bg-[#FF4FA3]/70 blur-[1px] particle-dust-1" />
          <div className="absolute top-[60%] left-[14%] w-3 h-3 rounded-full bg-[#35DDF5]/50 blur-[1.5px] particle-dust-2" />
          <div className="absolute top-[32%] right-[20%] w-2.5 h-2.5 rounded-full bg-[#FF8642]/60 blur-[1px] particle-dust-3" />
          <div className="absolute top-[72%] right-[26%] w-2 h-2 rounded-full bg-[#FF4FA3]/50 blur-[1px] particle-dust-1" />
          <div className="absolute top-[42%] left-[52%] w-1.5 h-1.5 rounded-full bg-[#FFE2EC]/80 blur-[0.5px] particle-dust-2" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center flex flex-col items-center">
          
          {/* GTA VI Atmosphere Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A0A24]/90 border border-[#FF4FA3]/50 backdrop-blur-md mb-8 hover:border-[#FF4FA3] transition-all shadow-[0_0_25px_rgba(255,42,133,0.45)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF4FA3] animate-ping" />
            <span className="text-xs uppercase tracking-[0.28em] font-extrabold text-[#FFE2EC]">
              Vice City • Leonida Gaming Era
            </span>
          </div>

          {/* Master Heading with GTA 6 Pinkish Bevel & Neon Bloom */}
          <h1 className="font-anton text-7xl sm:text-8xl md:text-9xl lg:text-[11.5rem] xl:text-[12.5rem] tracking-[0.05em] uppercase text-white leading-none mb-6 gta6-gradient-text drop-shadow-[0_16px_36px_rgba(0,0,0,0.95)]">
            VICEVERSE
          </h1>

          {/* Tagline: Single line on desktop, white for YOUR WORLD and YOUR IDENTITY, subtle pink-to-orange for YOUR GAME */}
          <p className="font-bebas text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.16em] sm:tracking-[0.2em] md:tracking-[0.22em] uppercase font-bold drop-shadow-[0_4px_24px_rgba(255,42,133,0.7)] mb-8 whitespace-normal md:whitespace-nowrap px-2">
            <span className="text-white">YOUR WORLD.&nbsp;&nbsp;</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4FA3] via-[#FF7582] to-[#FF9B61]">YOUR GAME.&nbsp;&nbsp;</span>
            <span className="text-white">YOUR IDENTITY.</span>
          </p>

          {/* Description */}
          <p className="max-w-2xl text-base sm:text-lg text-white/95 font-medium leading-relaxed mb-12 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] px-4">
            Discover gaming creators, explore premium streaming assets, elevate your content, and build your own identity in the gaming universe.
          </p>

          {/* CTAs with generous width, consistent height, single line desktop labels, and smooth spacing */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
            <Link
              to="/creators"
              className="w-full sm:w-[260px] md:w-[280px] h-[60px] px-8 rounded-2xl bg-gradient-to-r from-[#FF2A85] via-[#FF7582] to-[#FF8642] text-white font-anton text-xl tracking-wider uppercase shadow-[0_0_35px_rgba(255,42,133,0.7)] hover:shadow-[0_0_50px_rgba(255,42,133,0.95)] hover:scale-105 transition-all flex items-center justify-center gap-3 group active:scale-95 whitespace-nowrap"
            >
              <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              <span>Explore Creators</span>
            </Link>

            <Link
              to="/marketplace"
              className="w-full sm:w-[260px] md:w-[280px] h-[60px] px-8 rounded-2xl bg-[#151B2B]/90 hover:bg-[#1C253B] border border-white/20 hover:border-[#35DDF5] text-white font-anton text-xl tracking-wider uppercase hover:shadow-neon-cyan hover:scale-105 transition-all flex items-center justify-center gap-3 group active:scale-95 backdrop-blur-md whitespace-nowrap"
            >
              <Store className="w-5 h-5 text-[#35DDF5]" />
              <span>Explore Marketplace</span>
            </Link>
          </div>

          {/* Live Stats bar with increased vertical spacing and consistent Demo Metrics label */}
          <div className="mt-20 w-full max-w-4xl flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 border border-[#FF4FA3]/30 backdrop-blur-md mb-4 text-[10px] uppercase font-bold tracking-[0.24em] text-[#FFE2EC]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4FA3]" />
              <span>Platform Demo Metrics</span>
            </div>

            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#120F1D]/90 backdrop-blur-xl border border-[#FF4FA3]/25 shadow-[0_15px_40px_rgba(0,0,0,0.7)]">
              <div className="flex flex-col items-center text-center">
                <span className="font-anton text-3xl sm:text-4xl text-white tracking-wide">8+</span>
                <span className="text-[11px] uppercase tracking-wider text-[#A3A9BA] font-semibold mt-1">
                  Verified Creators
                </span>
              </div>
              <div className="flex flex-col items-center text-center border-l border-white/10">
                <span className="font-anton text-3xl sm:text-4xl text-[#35DDF5] tracking-wide">10M+</span>
                <span className="text-[11px] uppercase tracking-wider text-[#A3A9BA] font-semibold mt-1">
                  Community Reach
                </span>
              </div>
              <div className="flex flex-col items-center text-center border-l border-white/10">
                <span className="font-anton text-3xl sm:text-4xl text-[#FF4FA3] tracking-wide">8K & OBS</span>
                <span className="text-[11px] uppercase tracking-wider text-[#A3A9BA] font-semibold mt-1">
                  Wallpapers & OBS Assets
                </span>
              </div>
              <div className="flex flex-col items-center text-center border-l border-white/10">
                <span className="font-anton text-3xl sm:text-4xl text-[#FF8642] tracking-wide">0%</span>
                <span className="text-[11px] uppercase tracking-wider text-[#A3A9BA] font-semibold mt-1">
                  Creator Launch Fee
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FEATURED CREATORS SECTION
      ======================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        {/* Subtle Ambient Sunset Glow */}
        <div className="absolute top-1/2 -left-20 w-96 h-96 bg-[#FF2A85]/12 rounded-full blur-[140px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF4FA3]/15 text-[#FFE2EC] text-xs font-bold uppercase tracking-wider mb-2.5 border border-[#FF4FA3]/30 shadow-[0_0_15px_rgba(255,79,163,0.3)]">
              <Sparkles className="w-3.5 h-3.5 text-[#FF4FA3]" /> Leonida Featured Talent
            </div>
            <h2 className="font-anton text-4xl sm:text-5xl lg:text-6xl tracking-wide uppercase text-white">
              LEONIDA'S TOP <span className="gta6-gradient-text">STREAMERS</span>
            </h2>
            <p className="text-sm sm:text-base text-white/80 mt-2 max-w-lg">
              Discover the gaming creators setting the benchmark in tactical shooters, open world roleplay, and synthwave aesthetics.
            </p>
          </div>

          <Link
            to="/creators"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#35DDF5] hover:text-white transition-colors group"
          >
            <span>View All Creators</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-[#151B2B] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {featuredCreators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          POPULAR CATEGORIES SECTION (GTA VI ASSET VAULT)
      ======================================================== */}
      <section className="py-24 bg-gradient-to-b from-[#080A12] via-[#140C22]/70 to-[#080A12] border-y border-white/10 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#FF4FA3]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#35DDF5]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase font-extrabold tracking-[0.22em] text-[#35DDF5] px-3.5 py-1 rounded-full bg-[#35DDF5]/10 border border-[#35DDF5]/30 inline-block mb-3">
              Curated Asset Vault
            </span>
            <h2 className="font-anton text-4xl sm:text-5xl lg:text-6xl uppercase tracking-wide text-white mt-1">
              POPULAR <span className="gta6-gradient-text">CATEGORIES</span>
            </h2>
            <p className="text-sm sm:text-base text-white/80 mt-2">
              Equip your battlestation and live broadcast with verified digital packs built by elite creators.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/marketplace?category=${cat.slug}`}
                className="group p-5 rounded-2xl bg-gradient-to-b from-[#181226]/90 to-[#101421]/95 border border-white/10 hover:border-[#FF4FA3]/60 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-[0_12px_30px_-5px_rgba(255,79,163,0.35)] backdrop-blur-md"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#121626] border border-white/10 group-hover:border-[#FF4FA3]/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  {getCategoryIcon(cat.icon)}
                </div>
                <h3 className="font-anton text-base uppercase text-white group-hover:text-[#35DDF5] transition-colors line-clamp-1 mb-1">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-[#A3A9BA]">
                  {cat.product_count || '12+'} items
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          TRENDING DIGITAL PRODUCTS SECTION
      ======================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        {/* Subtle Ambient Sunset Glow */}
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-[#FF8642]/12 rounded-full blur-[140px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF9B61]/15 text-[#FFE2EC] text-xs font-bold uppercase tracking-wider mb-2.5 border border-[#FF9B61]/30 shadow-[0_0_15px_rgba(255,155,97,0.3)]">
              <Flame className="w-3.5 h-3.5 text-[#FF9B61]" /> High Demand Drops
            </div>
            <h2 className="font-anton text-4xl sm:text-5xl lg:text-6xl tracking-wide uppercase text-white">
              TRENDING <span className="gta6-gradient-text">DIGITAL PRODUCTS</span>
            </h2>
            <p className="text-sm sm:text-base text-white/80 mt-2 max-w-lg">
              High-converting YouTube thumbnail kits, animated twitch alerts, and 8K synthwave ultrawide wallpapers.
            </p>
          </div>

          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#FF4FA3] hover:text-white transition-colors group"
          >
            <span>Browse All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-[#151B2B] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          WHY VICEVERSE? (CINEMATIC 3-COLUMN FEATURE BENEFIT)
      ======================================================== */}
      <section className="py-24 bg-gradient-to-b from-[#080A12] via-[#120B1C]/50 to-[#080A12] border-t border-white/10 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#FF4FA3]/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-anton text-4xl sm:text-5xl lg:text-6xl uppercase tracking-wide text-white">
              WHY <span className="text-[#35DDF5]">VICEVERSE?</span>
            </h2>
            <p className="text-base text-white/80 mt-3 leading-relaxed">
              Built by gamers and digital designers to solve the fragmented linktree and generic stock marketplace experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#181226]/90 to-[#101421]/95 border border-white/10 hover:border-[#FF4FA3]/50 transition-all duration-300 relative overflow-hidden group hover:shadow-[0_16px_40px_-10px_rgba(255,79,163,0.35)] hover:-translate-y-1 backdrop-blur-md">
              <div className="w-14 h-14 rounded-2xl bg-[#FF4FA3]/15 flex items-center justify-center text-[#FF4FA3] mb-6 group-hover:scale-110 transition-transform">
                <Tv className="w-7 h-7" />
              </div>
              <h3 className="font-anton text-2xl uppercase text-white mb-3 group-hover:text-[#FF4FA3] transition-colors">
                All-in-One Creator Brand
              </h3>
              <p className="text-sm text-[#A3A9BA] leading-relaxed">
                Combine your personal link-in-bio, interactive portfolio gallery, live stream schedules, and digital shop into a single Vice City-themed vanity URL.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#181226]/90 to-[#101421]/95 border border-white/10 hover:border-[#35DDF5]/50 transition-all duration-300 relative overflow-hidden group hover:shadow-[0_16px_40px_-10px_rgba(53,221,245,0.35)] hover:-translate-y-1 backdrop-blur-md">
              <div className="w-14 h-14 rounded-2xl bg-[#35DDF5]/15 flex items-center justify-center text-[#35DDF5] mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="font-anton text-2xl uppercase text-white mb-3 group-hover:text-[#35DDF5] transition-colors">
                Instant Digital Delivery
              </h3>
              <p className="text-sm text-[#A3A9BA] leading-relaxed">
                Streamlined demo checkout generates unique license keys and instant asset downloads immediately upon order completion.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#181226]/90 to-[#101421]/95 border border-white/10 hover:border-[#FF9B61]/50 transition-all duration-300 relative overflow-hidden group hover:shadow-[0_16px_40px_-10px_rgba(255,155,97,0.35)] hover:-translate-y-1 backdrop-blur-md">
              <div className="w-14 h-14 rounded-2xl bg-[#FF9B61]/15 flex items-center justify-center text-[#FF9B61] mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-anton text-2xl uppercase text-white mb-3 group-hover:text-[#FF9B61] transition-colors">
                Verified Creator Ecosystem
              </h3>
              <p className="text-sm text-[#A3A9BA] leading-relaxed">
                Every creator on ViceVerse is vetted for authentic stream quality and graphic standards. Enjoy print-ready 300 DPI files and verified OBS compatibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          JOIN CREATOR COMMUNITY CTA BANNER
      ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div 
          className="relative rounded-3xl p-10 md:p-16 overflow-hidden border border-[#FF4FA3]/40 bg-cover bg-center shadow-[0_20px_50px_rgba(255,42,133,0.25)]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(8, 10, 18, 0.95) 0%, rgba(16, 20, 33, 0.85) 50%, rgba(8, 10, 18, 0.7) 100%), url('/assets/gta6/gta6-city-car.png')`
          }}
        >
          {/* Neon background graphics */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF4FA3]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#35DDF5]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4FA3]/15 text-[#FF4FA3] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Streamers & 3D Artists
            </span>
            <h2 className="font-anton text-4xl sm:text-5xl lg:text-6xl uppercase tracking-wide text-white leading-tight mb-4">
              CLAIM YOUR PIECE OF <span className="gradient-text-vice">VICE CITY</span>
            </h2>
            <p className="text-base text-[#A3A9BA] leading-relaxed mb-8">
              Join top gaming streamers and digital artists. Build your custom creator profile, showcase your clips and portfolio, and sell your assets directly to gaming enthusiasts.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#FF8642] text-white font-anton text-lg tracking-widest uppercase shadow-neon-pink hover:shadow-[0_0_35px_rgba(255,79,163,0.9)] transition-all flex items-center gap-2 group"
              >
                <span>Apply as Creator</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/creators"
                className="px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm tracking-wide transition-colors"
              >
                Explore Creator Roster
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
