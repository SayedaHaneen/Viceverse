import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Users, Eye, ArrowUpRight, Tv, Youtube, MessageSquare } from 'lucide-react';

export default function CreatorCard({ creator }) {
  const navigate = useNavigate();

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const interests = Array.isArray(creator.gaming_interests) ? creator.gaming_interests : [];

  const handleCardClick = () => {
    navigate(`/creator/${creator.username}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative rounded-2xl bg-gradient-to-b from-[#181226]/90 to-[#101421]/95 border border-white/10 hover:border-[#FF4FA3]/70 transition-all duration-300 overflow-hidden flex flex-col hover:shadow-[0_16px_40px_-10px_rgba(255,42,133,0.45)] cursor-pointer hover:-translate-y-1.5 backdrop-blur-md"
    >
      {/* Top subtle neon accent line */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF4FA3]/40 to-transparent group-hover:via-[#FF4FA3] transition-all" />

      {/* COVER BANNER */}
      <div className="relative h-32 w-full overflow-hidden bg-[#0A0D18]">
        <img
          src={creator.cover_url || 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80'}
          alt={`${creator.display_name} cover`}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121626] via-transparent to-black/40" />
        
        {/* Featured Game Tag */}
        {creator.featured_game && (
          <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#35DDF5]/30 text-[10px] font-bold text-[#E6FAFD] uppercase tracking-wider shadow-sm">
            {creator.featured_game}
          </div>
        )}
      </div>

      {/* AVATAR & BASIC INFO */}
      <div className="px-5 pb-5 pt-0 relative flex-1 flex flex-col">
        {/* Floating Avatar & Social Icons */}
        <div className="-mt-12 mb-3 flex items-end justify-between">
          <div className="relative">
            <img
              src={creator.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={creator.display_name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#121626] shadow-2xl ring-2 ring-[#FF4FA3]/40 group-hover:ring-[#FF4FA3] group-hover:scale-105 transition-all"
            />
            {creator.is_verified ? (
              <div className="absolute -bottom-1 -right-1 bg-[#35DDF5] text-black rounded-full p-0.5 shadow-[0_0_10px_rgba(53,221,245,0.7)]" title="Verified Leonida Creator">
                <CheckCircle2 className="w-4 h-4 fill-black text-[#35DDF5]" />
              </div>
            ) : null}
          </div>

          {/* Social Quick Icons (stop propagation so external link opens cleanly) */}
          <div className="flex items-center gap-1.5 pb-1" onClick={(e) => e.stopPropagation()}>
            {creator.social_links?.slice(0, 3).map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-lg bg-[#0E121E] hover:bg-[#FF4FA3]/25 border border-white/10 hover:border-[#FF4FA3]/50 flex items-center justify-center text-white/70 hover:text-white transition-all text-xs"
                title={link.title || link.platform}
              >
                {link.platform === 'twitch' && <Tv className="w-3.5 h-3.5 text-[#C084FC]" />}
                {link.platform === 'youtube' && <Youtube className="w-3.5 h-3.5 text-[#FF4FA3]" />}
                {link.platform === 'discord' && <MessageSquare className="w-3.5 h-3.5 text-[#35DDF5]" />}
                {!['twitch', 'youtube', 'discord'].includes(link.platform) && (
                  <span className="text-[10px] uppercase font-bold">{link.platform.substring(0, 2)}</span>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* NAMES */}
        <div className="mb-2">
          <h3
            className="font-anton text-xl uppercase tracking-wide text-white group-hover:text-[#FF4FA3] transition-colors flex items-center gap-1.5"
          >
            {creator.display_name}
          </h3>
          <span className="text-xs text-[#35DDF5] font-mono">@{creator.username}</span>
        </div>

        {/* BIO */}
        <p className="text-xs text-[#A3A9BA] line-clamp-2 mb-4 leading-relaxed flex-1">
          {creator.tagline || creator.bio || 'Gaming streamer and digital asset creator based in Vice City.'}
        </p>

        {/* GAMING TAGS */}
        {interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {interests.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-md bg-[#0D101C] border border-white/5 text-[10px] font-semibold text-white/80"
              >
                {tag}
              </span>
            ))}
            {interests.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-md bg-[#0D101C] text-[10px] text-white/40 font-semibold">
                +{interests.length - 3}
              </span>
            )}
          </div>
        )}

        {/* STATS & CTA BUTTON */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3.5 text-xs text-[#A3A9BA]">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#35DDF5]" />
              <strong className="text-white font-semibold">{formatNumber(creator.follower_count)}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-[#FF9B61]" />
              <strong className="text-white font-semibold">{formatNumber(creator.view_count)}</strong>
            </span>
          </div>

          <div
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 group-hover:bg-gradient-to-r group-hover:from-[#FF4FA3] group-hover:to-[#FF8642] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 group-hover:shadow-[0_0_15px_rgba(255,79,163,0.6)]"
          >
            <span>View</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
