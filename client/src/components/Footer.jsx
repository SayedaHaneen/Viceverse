import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Tv, ShieldCheck, Heart, Sparkles, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[#05070C] border-t border-white/10 text-white pt-16 pb-12 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF4FA3]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#35DDF5]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* BRAND COLUMN */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF4FA3] via-[#FF9B61] to-[#35DDF5] p-0.5 shadow-neon-pink">
                <div className="w-full h-full bg-[#080A12] rounded-[10px] flex items-center justify-center">
                  <span className="font-bebas text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#FF4FA3] to-[#35DDF5] font-bold">
                    VV
                  </span>
                </div>
              </div>
              <span className="font-anton text-2xl tracking-[0.18em] uppercase text-white">
                VICE<span className="text-[#FF4FA3]">VERSE</span>
              </span>
            </Link>
            <p className="text-sm text-[#A3A9BA] max-w-sm leading-relaxed">
              The premier gaming creator hub & digital assets marketplace inspired by the neon atmosphere of Vice City and next-gen open world gaming. Showcase your brand, discover top streamers, and equip your stream with 8K digital assets.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4FA3]/10 border border-[#FF4FA3]/30 text-[#FF4FA3] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Next-Gen Gaming Hub
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35DDF5]/10 border border-[#35DDF5]/30 text-[#35DDF5] text-xs font-semibold">
                <Gamepad2 className="w-3.5 h-3.5" /> GTA VI Era
              </span>
            </div>
          </div>

          {/* EXPLORE */}
          <div className="space-y-3">
            <h4 className="font-bebas text-lg tracking-wider text-white uppercase text-glow-cyan">
              Explore Platform
            </h4>
            <ul className="space-y-2 text-sm text-[#A3A9BA]">
              <li>
                <Link to="/creators" className="hover:text-[#35DDF5] transition-colors">
                  Featured Creators
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="hover:text-[#35DDF5] transition-colors">
                  Digital Marketplace
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=gaming-wallpapers" className="hover:text-[#35DDF5] transition-colors">
                  8K Wallpapers
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=stream-overlays" className="hover:text-[#35DDF5] transition-colors">
                  Animated Stream Packs
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=youtube-thumbnails" className="hover:text-[#35DDF5] transition-colors">
                  High-CTR Thumbnails
                </Link>
              </li>
            </ul>
          </div>

          {/* CREATORS */}
          <div className="space-y-3">
            <h4 className="font-bebas text-lg tracking-wider text-white uppercase text-glow-pink">
              For Streamers
            </h4>
            <ul className="space-y-2 text-sm text-[#A3A9BA]">
              <li>
                <Link to="/register" className="hover:text-[#FF4FA3] transition-colors">
                  Create Creator Profile
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#FF4FA3] transition-colors">
                  Creator Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#FF4FA3] transition-colors">
                  Upload Portfolio
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#FF4FA3] transition-colors">
                  Sell Digital Products
                </Link>
              </li>
              <li>
                <Link to="/creators" className="hover:text-[#FF4FA3] transition-colors">
                  Streaming Schedules
                </Link>
              </li>
            </ul>
          </div>

          {/* DEMO NEWSLETTER / COMMUNITY */}
          <div className="space-y-3">
            <h4 className="font-bebas text-lg tracking-wider text-white uppercase text-glow-orange">
              Developer & Socials
            </h4>
            <div className="p-3.5 rounded-2xl bg-[#101421] border border-[#FF4FA3]/25 space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#FF4FA3] block">
                ⭐ Developer Spotlight
              </span>
              <p className="text-xs text-white/90 font-medium">
                Engineered with passion by <span className="text-white font-bold">Sayeda Haneen</span>
              </p>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href="https://www.linkedin.com/in/sayedahaneenhussain/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#35DDF5]/20 border border-white/10 hover:border-[#35DDF5] text-[11px] font-semibold text-white/80 hover:text-[#35DDF5] transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/SayedaHaneen"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#FF4FA3]/20 border border-white/10 hover:border-[#FF4FA3] text-[11px] font-semibold text-white/80 hover:text-[#FF4FA3] transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://github.com/SayedaHaneen/viceverse"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#FF9B61]/20 border border-white/10 hover:border-[#FF9B61] text-[11px] font-semibold text-white/80 hover:text-[#FF9B61] transition-colors"
                >
                  Repository
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM DISCLAIMER & COPYRIGHT */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#A3A9BA]">
          <p>
            © {new Date().getFullYear()} VICEVERSE. Developed by <span className="text-white font-semibold">Sayeda Haneen</span>. Built with passion for gaming creators.
          </p>
          <div className="text-center md:text-right text-[11px] text-[#A3A9BA]/70 max-w-xl">
            <span className="font-semibold text-white/90">Disclaimer:</span> VICEVERSE is an independent, university-level fan-inspired conceptual project. It is NOT an official Rockstar Games product, and is not affiliated with or endorsed by Take-Two Interactive or Rockstar Games.
          </div>
        </div>
      </div>
    </footer>
  );
}
