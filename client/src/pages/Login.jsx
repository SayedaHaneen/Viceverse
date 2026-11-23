import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Demo 1-Click quick login handler
  const handleQuickLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, demoPass);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-[90vh] flex items-center justify-center px-4 py-16 relative overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(8,10,18,0.82), rgba(8,10,18,0.96)), url('/assets/gta6/gta6-hero-sunset.jpg')`
      }}
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#FF2A85]/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#35DDF5]/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        
        {/* CARD */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#181126]/95 to-[#101421]/95 backdrop-blur-xl border border-[#FF4FA3]/30 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-3">
              <span className="font-anton text-3xl tracking-[0.18em] uppercase text-white">
                VICE<span className="text-[#FF4FA3]">VERSE</span>
              </span>
            </Link>
            <h2 className="font-anton text-2xl uppercase tracking-wider text-white">
              ACCESS YOUR ACCOUNT
            </h2>
            <p className="text-xs text-[#A3A9BA] mt-1">
              Sign in to manage your creator profile, stream assets & orders.
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold leading-relaxed">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A3A9BA] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#151B2B] border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#35DDF5] focus:ring-1 focus:ring-[#35DDF5] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A3A9BA]">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-[#151B2B] border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#35DDF5] focus:ring-1 focus:ring-[#35DDF5] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-[#FF2A85] via-[#FF7582] to-[#FF8642] text-white font-anton text-lg uppercase tracking-wider shadow-[0_0_25px_rgba(255,42,133,0.6)] hover:shadow-[0_0_40px_rgba(255,42,133,0.9)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to ViceVerse</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#35DDF5] block text-center">
              ⚡ 1-Click Quick Demo Accounts
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@viceverse.gg', 'ViceAdmin2026!')}
                className="p-2 rounded-xl bg-[#151B2B] hover:bg-[#35DDF5]/15 border border-white/10 hover:border-[#35DDF5]/40 text-center transition-all group"
              >
                <ShieldCheck className="w-4 h-4 text-[#35DDF5] mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-white block uppercase">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('neon@viceverse.gg', 'CreatorPass123!')}
                className="p-2 rounded-xl bg-[#151B2B] hover:bg-[#FF4FA3]/15 border border-white/10 hover:border-[#FF4FA3]/40 text-center transition-all group"
              >
                <Sparkles className="w-4 h-4 text-[#FF4FA3] mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-white block uppercase">Creator</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('player1@viceverse.gg', 'GamerPass123!')}
                className="p-2 rounded-xl bg-[#151B2B] hover:bg-[#FF9B61]/15 border border-white/10 hover:border-[#FF9B61]/40 text-center transition-all group"
              >
                <UserCheck className="w-4 h-4 text-[#FF9B61] mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-white block uppercase">Gamer</span>
              </button>
            </div>
          </div>

          {/* Switch to Register */}
          <div className="mt-6 text-center text-xs text-[#A3A9BA]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#FF4FA3] hover:underline font-bold">
              Register here &rarr;
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
