import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div 
      className="min-h-[85vh] flex flex-col items-center justify-center px-4 text-center text-white relative overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(8,10,18,0.85), rgba(8,10,18,0.96)), url('/assets/gta6/gta6-hero-sunset.jpg')`
      }}
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#FF2A85]/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#35DDF5]/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A0B20]/90 border border-[#FF4FA3]/40 text-[#FFE2EC] text-xs font-bold uppercase tracking-[0.2em] mb-6 shadow-[0_0_20px_rgba(255,42,133,0.3)]">
          <Compass className="w-3.5 h-3.5 text-[#35DDF5]" /> Out of Bounds • Zone 404
        </div>
        
        <h1 className="font-anton text-8xl sm:text-9xl md:text-[10rem] tracking-wider uppercase text-white mb-2 leading-none gta6-gradient-text drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)]">
          404
        </h1>
        
        <h2 className="font-bebas text-2xl sm:text-3xl uppercase tracking-widest text-white mb-4">
          You've wandered outside Leonida state lines
        </h2>
        
        <p className="text-sm text-[#A3A9BA] max-w-md mx-auto mb-8 leading-relaxed font-normal">
          The neon coordinates you requested do not exist or were confiscated by the Vice City authorities. Head back to the safe zone.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF2A85] via-[#FF7582] to-[#FF8642] text-white font-anton text-base uppercase tracking-wider shadow-[0_0_25px_rgba(255,42,133,0.6)] hover:shadow-[0_0_40px_rgba(255,42,133,0.9)] hover:scale-105 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return to Ocean Drive</span>
          </Link>
          <Link
            to="/marketplace"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#151B2B]/90 hover:bg-[#1C253B] border border-white/20 hover:border-[#35DDF5] text-white font-anton text-base uppercase tracking-wider hover:shadow-neon-cyan hover:scale-105 transition-all flex items-center justify-center gap-2 active:scale-95 backdrop-blur-md"
          >
            <span>Browse Marketplace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}