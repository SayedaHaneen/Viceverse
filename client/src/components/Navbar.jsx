import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  User, 
  LayoutDashboard, 
  ShieldCheck, 
  LogOut, 
  Sparkles,
  Compass,
  Store,
  ChevronDown,
  Bookmark
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isCreator, isAdmin, logout } = useAuth();
  const { cart, setIsCartOpen } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-[#FF4FA3] via-[#FF9B61] to-[#35DDF5] p-0.5 shadow-neon-pink group-hover:shadow-[0_0_25px_rgba(255,79,163,0.8)] transition-all duration-300">
            <div className="w-full h-full bg-[#080A12] rounded-[10px] flex items-center justify-center">
              <span className="font-bebas text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#FF4FA3] to-[#35DDF5] font-bold">
                VV
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-anton text-2xl tracking-[0.18em] uppercase text-white group-hover:text-[#35DDF5] transition-colors leading-none">
              VICE<span className="text-[#FF4FA3]">VERSE</span>
            </span>
            <span className="text-[10px] tracking-widest text-[#A3A9BA] uppercase font-semibold mt-1">
              Gaming Hub
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all ${
              isActive('/')
                ? 'text-[#FF4FA3] bg-[#FF4FA3]/10 shadow-[inset_0_0_12px_rgba(255,79,163,0.2)]'
                : 'text-white/80 hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </Link>
          <Link
            to="/creators"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all ${
              isActive('/creators')
                ? 'text-[#35DDF5] bg-[#35DDF5]/10 shadow-[inset_0_0_12px_rgba(53,221,245,0.2)]'
                : 'text-white/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4 text-[#35DDF5]" />
            Discover Creators
          </Link>
          <Link
            to="/marketplace"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all ${
              isActive('/marketplace')
                ? 'text-[#FF9B61] bg-[#FF9B61]/10 shadow-[inset_0_0_12px_rgba(255,155,97,0.2)]'
                : 'text-white/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <Store className="w-4 h-4 text-[#FF9B61]" />
            Marketplace
          </Link>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">
          {/* CART BUTTON */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-[#151B2B] hover:bg-[#1C253B] border border-white/10 hover:border-[#35DDF5]/50 text-white transition-all duration-200 group"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-white/90 group-hover:text-[#35DDF5] transition-colors" />
            {cart.itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-gradient-to-r from-[#FF4FA3] to-[#FF9B61] text-white text-[11px] font-bold shadow-neon-pink animate-pulse">
                {cart.itemCount}
              </span>
            )}
          </button>

          {/* AUTHENTICATION */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-[#151B2B] border border-white/10 hover:border-[#FF4FA3]/50 transition-all text-left"
              >
                <img
                  src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={user.username}
                  className="w-8 h-8 rounded-lg object-cover border border-[#FF4FA3]/30"
                />
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-bold text-white leading-tight">
                    {user.username}
                  </span>
                  <span className="text-[10px] text-[#35DDF5] uppercase tracking-wider font-semibold">
                    {user.role}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-white/60 ml-0.5" />
              </button>

              {/* DROPDOWN MENU */}
              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#101421] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs font-semibold text-white truncate">{user.full_name}</p>
                    <p className="text-[11px] text-[#A3A9BA] truncate">{user.email}</p>
                  </div>

                  {isCreator && (
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/90 hover:text-white hover:bg-[#FF4FA3]/15 hover:text-[#FF4FA3] transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#FF4FA3]" />
                      Creator Dashboard
                    </Link>
                  )}

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/90 hover:text-white hover:bg-[#35DDF5]/15 hover:text-[#35DDF5] transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#35DDF5]" />
                      Admin Control Panel
                    </Link>
                  )}

                  <Link
                    to="/cart"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/90 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#FF9B61]" />
                    My Cart & Orders
                  </Link>

                  <div className="my-1 border-t border-white/10" />

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-white/90 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="relative inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider text-white overflow-hidden group shadow-neon-pink"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#FF4FA3] via-[#FF8642] to-[#FF4FA3] bg-[length:200%_auto] group-hover:bg-right transition-all duration-500" />
                <span className="relative z-10 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Get Started
                </span>
              </Link>
            </div>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#151B2B] text-white border border-white/10"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#080A12]/98 border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-white/5"
          >
            Home
          </Link>
          <Link
            to="/creators"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-[#35DDF5] hover:bg-white/5"
          >
            Discover Creators
          </Link>
          <Link
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-[#FF9B61] hover:bg-white/5"
          >
            Marketplace
          </Link>

          {isAuthenticated ? (
            <>
              {isCreator && (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-[#FF4FA3] hover:bg-white/5"
                >
                  Creator Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-[#35DDF5] hover:bg-white/5"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-400 hover:bg-white/5"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl border border-white/15 text-white font-medium"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#FF9B61] text-white font-bold"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
