import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { 
  CheckCircle2, 
  Users, 
  Eye, 
  Calendar, 
  Gamepad2, 
  Tv, 
  Youtube, 
  MessageSquare, 
  Share2, 
  ExternalLink,
  Sparkles,
  ShoppingBag,
  Grid,
  Heart,
  X,
  Layers
} from 'lucide-react';

export default function CreatorProfile() {
  const { username } = useParams();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [selectedLightboxImage, setSelectedLightboxImage] = useState(null);

  useEffect(() => {
    async function loadCreator() {
      setLoading(true);
      try {
        const res = await api.getCreator(username);
        if (res.success && res.creator) {
          setCreator(res.creator);
        }
      } catch (err) {
        console.error('Failed to load creator:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCreator();
  }, [username]);

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 max-w-7xl mx-auto flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FF4FA3]/30 border-t-[#FF4FA3] rounded-full animate-spin mb-4" />
        <p className="font-bebas text-lg tracking-wider uppercase text-white/70">
          Entering Creator District...
        </p>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen py-24 px-4 text-center max-w-md mx-auto">
        <h2 className="font-anton text-3xl uppercase text-white mb-2">Creator Not Found</h2>
        <p className="text-sm text-[#A3A9BA] mb-6">
          The creator "@{username}" does not exist or has changed their handle.
        </p>
        <Link
          to="/creators"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#FF9B61] text-white font-bold text-xs uppercase"
        >
          Back to Creator Discovery
        </Link>
      </div>
    );
  }

  const interests = Array.isArray(creator.gaming_interests) ? creator.gaming_interests : [];

  return (
    <div className="min-h-screen pb-24 text-white">
      
      {/* ========================================================
          COVER BANNER & AMBIENCE
      ======================================================== */}
      <div className="relative h-72 sm:h-88 md:h-[400px] w-full overflow-hidden bg-[#080A12]">
        <img
          src={creator.cover_url || 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=2000&q=80'}
          alt={`${creator.display_name} cover`}
          className="w-full h-full object-cover object-center filter saturate-[1.25] brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080A12] via-[#080A12]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF2A85]/15 via-transparent to-[#35DDF5]/15 pointer-events-none" />
      </div>

      {/* ========================================================
          CREATOR HEADER / BIO CARD
      ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 sm:-mt-32 relative z-10">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#181126]/95 to-[#101421]/95 backdrop-blur-xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
            {/* Avatar & Identifiers */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
              <div className="relative -mt-20 sm:-mt-24">
                <img
                  src={creator.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={creator.display_name}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl object-cover border-4 border-[#121626] shadow-2xl ring-4 ring-[#FF4FA3]/50 transition-all"
                />
                {creator.is_verified && (
                  <div className="absolute -bottom-1 -right-1 p-1.5 bg-[#35DDF5] text-black rounded-xl shadow-[0_0_15px_rgba(53,221,245,0.7)]" title="Verified Leonida Creator">
                    <CheckCircle2 className="w-5 h-5 fill-black text-[#35DDF5]" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="font-anton text-4xl sm:text-5xl lg:text-6xl uppercase tracking-wide text-white">
                    {creator.display_name}
                  </h1>
                </div>
                <div className="text-sm font-mono text-[#FF4FA3] mt-1 font-semibold">
                  @{creator.username}
                </div>
                <p className="text-xs sm:text-sm text-white/85 mt-2.5 max-w-xl leading-relaxed">
                  {creator.tagline || creator.bio}
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center justify-center sm:justify-end gap-6 bg-[#181E32]/90 px-6 py-4 rounded-2xl border border-white/10 shadow-lg">
              <div className="text-center">
                <span className="font-anton text-2xl text-white tracking-wide block">
                  {formatNumber(creator.follower_count)}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#35DDF5] flex items-center justify-center gap-1">
                  <Users className="w-3 h-3" /> Followers
                </span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-center">
                <span className="font-anton text-2xl text-white tracking-wide block">
                  {formatNumber(creator.view_count)}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#FF9B61] flex items-center justify-center gap-1">
                  <Eye className="w-3 h-3" /> Views
                </span>
              </div>
            </div>
          </div>

          {/* Social Links & Schedule */}
          <div className="pt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Social Link Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {creator.social_links?.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#151B2B] hover:bg-[#FF4FA3]/20 border border-white/10 hover:border-[#FF4FA3]/50 text-xs font-semibold text-white/90 hover:text-white transition-all shadow-sm group"
                >
                  {link.platform === 'twitch' && <Tv className="w-4 h-4 text-[#A855F7]" />}
                  {link.platform === 'youtube' && <Youtube className="w-4 h-4 text-[#FF4FA3]" />}
                  {link.platform === 'discord' && <MessageSquare className="w-4 h-4 text-[#35DDF5]" />}
                  {!['twitch', 'youtube', 'discord'].includes(link.platform) && (
                    <ExternalLink className="w-4 h-4 text-[#FF9B61]" />
                  )}
                  <span>{link.title || link.platform}</span>
                </a>
              ))}
            </div>

            {/* Schedule & Game */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#A3A9BA]">
              {creator.streaming_schedule && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151B2B] border border-white/5">
                  <Calendar className="w-3.5 h-3.5 text-[#35DDF5]" />
                  <span>{creator.streaming_schedule}</span>
                </div>
              )}
              {creator.featured_game && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151B2B] border border-white/5">
                  <Gamepad2 className="w-3.5 h-3.5 text-[#FF9B61]" />
                  <span>Main: <strong>{creator.featured_game}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Gaming Tag Pills */}
          {interests.length > 0 && (
            <div className="pt-4 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#A3A9BA] mr-1">
                Interests:
              </span>
              {interests.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md bg-[#151B2B] text-xs text-white/80 border border-white/5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* ========================================================
          CREATOR CONTENT TABS
      ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
              activeTab === 'portfolio'
                ? 'bg-gradient-to-r from-[#FF4FA3] to-[#FF8642] text-white shadow-neon-pink'
                : 'bg-[#151B2B] text-[#A3A9BA] hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Portfolio Gallery ({creator.portfolio?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-[#35DDF5] to-[#A855F7] text-white shadow-neon-cyan'
                : 'bg-[#151B2B] text-[#A3A9BA] hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Digital Store ({creator.products?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
              activeTab === 'about'
                ? 'bg-white/15 text-white'
                : 'bg-[#151B2B] text-[#A3A9BA] hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>About Stream</span>
          </button>
        </div>

        {/* TAB 1: PORTFOLIO */}
        {activeTab === 'portfolio' && (
          <div>
            {(!creator.portfolio || creator.portfolio.length === 0) ? (
              <div className="py-16 text-center rounded-2xl bg-[#101421] border border-white/5 p-8">
                <p className="text-sm text-[#A3A9BA]">No portfolio pieces published yet by this creator.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {creator.portfolio.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedLightboxImage(item)}
                    className="group relative rounded-2xl bg-[#151B2B] border border-white/10 hover:border-[#FF4FA3]/50 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-neon-pink"
                  >
                    <div className="aspect-[16/10] w-full overflow-hidden bg-[#080A12]">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#35DDF5]">
                          {item.category || 'Artwork'}
                        </span>
                        <span className="text-xs text-[#A3A9BA] flex items-center gap-1">
                          <Eye className="w-3 h-3 text-[#FF9B61]" /> {formatNumber(item.view_count)}
                        </span>
                      </div>
                      <h4 className="font-anton text-base uppercase text-white group-hover:text-[#FF4FA3] transition-colors truncate">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-xs text-[#A3A9BA] line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div>
            {(!creator.products || creator.products.length === 0) ? (
              <div className="py-16 text-center rounded-2xl bg-[#101421] border border-white/5 p-8">
                <p className="text-sm text-[#A3A9BA]">No digital products currently listed by this creator.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {creator.products.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={{
                      ...prod,
                      seller_username: creator.username,
                      seller_name: creator.display_name,
                      seller_avatar: creator.avatar_url,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ABOUT */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 p-8 rounded-3xl bg-[#101421] border border-white/10 space-y-6">
              <div>
                <h3 className="font-anton text-2xl uppercase text-white mb-2">Creator Biography</h3>
                <p className="text-sm text-[#A3A9BA] leading-relaxed whitespace-pre-line">
                  {creator.bio || 'Gaming streamer and digital assets designer on VICEVERSE.'}
                </p>
              </div>

              <div>
                <h3 className="font-anton text-xl uppercase text-white mb-2">Gaming Focus</h3>
                <p className="text-xs text-[#A3A9BA] leading-relaxed">
                  Specialized in competitive titles, roleplaying narratives in the GTA VI universe, and creating atmospheric 8K visual packs.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#101421] border border-white/10 space-y-6">
              <h3 className="font-anton text-xl uppercase text-white mb-2">Channel Specs</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-[#A3A9BA]">Primary Game</span>
                  <span className="text-white font-semibold">{creator.featured_game || 'GTA VI'}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-[#A3A9BA]">Broadcast Schedule</span>
                  <span className="text-[#35DDF5] font-semibold">{creator.streaming_schedule || 'Check Twitch'}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-[#A3A9BA]">Status</span>
                  <span className="text-[#FF4FA3] font-semibold">Verified Streamer</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* LIGHTBOX MODAL FOR PORTFOLIO */}
      {selectedLightboxImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-4xl w-full bg-[#101421] rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedLightboxImage(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/70 hover:bg-black text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedLightboxImage.image_url}
                alt={selectedLightboxImage.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold tracking-wider text-[#35DDF5]">
                  {selectedLightboxImage.category}
                </span>
                <span className="text-xs text-[#A3A9BA]">
                  {selectedLightboxImage.tags}
                </span>
              </div>
              <h3 className="font-anton text-2xl uppercase text-white">
                {selectedLightboxImage.title}
              </h3>
              <p className="text-xs text-[#A3A9BA] mt-2 leading-relaxed">
                {selectedLightboxImage.description}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
