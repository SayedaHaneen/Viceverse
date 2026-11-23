import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, User, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    isCreator: true, // Default to creator for streaming hub
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      await register({
        full_name: formData.full_name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.isCreator ? 'creator' : 'user',
      });
      navigate(formData.isCreator ? '/dashboard' : '/');
    } catch (err) {
      setError(err.message || 'Registration failed.');
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
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-[#FF2A85]/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[#35DDF5]/15 rounded-full blur-[130px] pointer-events-none" />

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
              CREATE YOUR GAMING IDENTITY
            </h2>
            <p className="text-xs text-[#A3A9BA] mt-1">
              Join the next generation of gaming streamers and digital asset creators.
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
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A3A9BA] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="full_name"
                  required
                  placeholder="e.g. Maya Torres"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#151B2B] border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#35DDF5] focus:ring-1 focus:ring-[#35DDF5] transition-all"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A3A9BA] mb-1.5">
                Username / Gamer Handle
              </label>
              <div className="relative">
                <span className="text-white/40 font-mono text-sm absolute left-3.5 top-1/2 -translate-y-1/2">@</span>
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="neonvalkyrie"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#151B2B] border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#35DDF5] focus:ring-1 focus:ring-[#35DDF5] transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A3A9BA] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="creator@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#151B2B] border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FF4FA3]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A3A9BA] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#151B2B] border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FF4FA3]"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A3A9BA] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#151B2B] border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FF4FA3]"
                />
              </div>
            </div>

            {/* Creator Mode Toggle */}
            <div className="p-3.5 rounded-2xl bg-[#151B2B] border border-white/10 flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#FF4FA3]" />
                <div>
                  <span className="text-xs font-bold text-white block uppercase">
                    Register as Gaming Creator
                  </span>
                  <span className="text-[10px] text-[#A3A9BA]">
                    Enables Creator Profile, Portfolio and Marketplace Shop
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                name="isCreator"
                checked={formData.isCreator}
                onChange={handleChange}
                className="w-4 h-4 rounded text-[#FF4FA3] focus:ring-[#FF4FA3] accent-[#FF4FA3]"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-[#FF2A85] via-[#FF7582] to-[#FF8642] text-white font-anton text-lg uppercase tracking-wider shadow-[0_0_25px_rgba(255,42,133,0.6)] hover:shadow-[0_0_40px_rgba(255,42,133,0.9)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account & Join</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center text-xs text-[#A3A9BA]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#35DDF5] hover:underline font-bold">
              Sign in here &rarr;
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
