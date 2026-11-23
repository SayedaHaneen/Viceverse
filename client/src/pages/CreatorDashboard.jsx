import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { 
  LayoutDashboard, 
  UserPen, 
  Image, 
  Share2, 
  Bookmark, 
  Settings, 
  LogOut, 
  Upload, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  Save, 
  CheckCircle2,
  Users,
  Eye,
  ShoppingBag,
  Tv,
  Youtube,
  MessageSquare,
  X
} from 'lucide-react';

export default function CreatorDashboard() {
  const { user, creatorProfile, logout, refreshProfile } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    display_name: '',
    tagline: '',
    bio: '',
    featured_game: '',
    streaming_schedule: '',
    banner_color: '#FF4FA3',
    cover_url: '',
    avatar_url: '',
    gaming_interests: [],
  });

  const [newTag, setNewTag] = useState('');

  // Social Links State
  const [socialLinks, setSocialLinks] = useState([]);
  const [newSocial, setNewSocial] = useState({ platform: 'twitch', url: '', title: '', is_primary: false });

  // Portfolio State
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({
    title: '',
    description: '',
    image_url: '',
    category: '3D Artwork',
    tags: '',
  });

  // Sync profile data from context or fetch
  useEffect(() => {
    async function loadFullCreatorData() {
      if (!user) return;
      try {
        const res = await api.getCreator(user.username);
        if (res.success && res.creator) {
          const c = res.creator;
          setProfileForm({
            display_name: c.display_name || user.full_name || '',
            tagline: c.tagline || '',
            bio: c.bio || '',
            featured_game: c.featured_game || 'GTA VI',
            streaming_schedule: c.streaming_schedule || 'Mon/Wed/Fri 8 PM EST',
            banner_color: c.banner_color || '#FF4FA3',
            cover_url: c.cover_url || '',
            avatar_url: c.avatar_url || user.avatar_url || '',
            gaming_interests: Array.isArray(c.gaming_interests) ? c.gaming_interests : [],
          });
          setSocialLinks(c.social_links || []);
          setPortfolioItems(c.portfolio || []);
        }
      } catch (err) {
        console.warn('Could not load creator data:', err);
      }
    }

    loadFullCreatorData();
  }, [user]);

  // Profile update submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.updateCreatorProfile(profileForm);
      if (res.success) {
        addToast('Creator profile updated successfully!', 'success');
        await refreshProfile();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Add tag
  const handleAddTag = () => {
    if (newTag.trim() && !profileForm.gaming_interests.includes(newTag.trim())) {
      setProfileForm((prev) => ({
        ...prev,
        gaming_interests: [...prev.gaming_interests, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove) => {
    setProfileForm((prev) => ({
      ...prev,
      gaming_interests: prev.gaming_interests.filter((t) => t !== tagToRemove),
    }));
  };

  // Save social links
  const handleSaveSocials = async () => {
    setLoading(true);
    try {
      const res = await api.updateSocialLinks(socialLinks);
      if (res.success) {
        addToast('Social media links saved!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to save social links.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSocial = () => {
    if (!newSocial.url) {
      addToast('Please enter a URL for the social channel.', 'error');
      return;
    }
    setSocialLinks((prev) => [...prev, { ...newSocial, id: Date.now() }]);
    setNewSocial({ platform: 'twitch', url: '', title: '', is_primary: false });
  };

  const handleRemoveSocial = (index) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
  };

  // Add portfolio item
  const handleAddPortfolio = async (e) => {
    e.preventDefault();
    if (!newPortfolio.title || !newPortfolio.image_url) {
      addToast('Title and image URL are required.', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await api.addPortfolioItem(newPortfolio);
      if (res.success) {
        setPortfolioItems((prev) => [res.item, ...prev]);
        setShowPortfolioModal(false);
        setNewPortfolio({ title: '', description: '', image_url: '', category: '3D Artwork', tags: '' });
        addToast('New portfolio piece added!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to add portfolio item.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete portfolio item
  const handleDeletePortfolio = async (id) => {
    if (!window.confirm('Delete this portfolio item?')) return;
    try {
      const res = await api.deletePortfolioItem(id);
      if (res.success) {
        setPortfolioItems((prev) => prev.filter((item) => item.id !== id));
        addToast('Portfolio item removed.', 'info');
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete item.', 'error');
    }
  };

  // Image Upload helper
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(type, file);

    try {
      addToast(`Uploading ${type}...`, 'info');
      const res = await api.uploadMedia(formData);
      if (res.success && res.url) {
        if (type === 'cover') {
          setProfileForm((prev) => ({ ...prev, cover_url: res.url }));
        } else if (type === 'avatar') {
          setProfileForm((prev) => ({ ...prev, avatar_url: res.url }));
        } else if (type === 'portfolio') {
          setNewPortfolio((prev) => ({ ...prev, image_url: res.url }));
        }
        addToast('Image uploaded and preview updated!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'File upload failed.', 'error');
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4FA3]/15 text-[#FF4FA3] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Streamer Control Center
          </div>
          <h1 className="font-anton text-3xl sm:text-4xl uppercase tracking-wide text-white">
            CREATOR <span className="gradient-text-vice">DASHBOARD</span>
          </h1>
          <p className="text-xs text-[#A3A9BA] mt-1">
            Manage your personal ViceVerse gaming profile, links, portfolio, and digital drops.
          </p>
        </div>

        <Link
          to={`/creator/${user?.username}`}
          target="_blank"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#35DDF5] to-[#A855F7] text-white font-bold text-xs uppercase tracking-wider shadow-neon-cyan hover:shadow-[0_0_25px_rgba(53,221,245,0.8)] transition-all"
        >
          <span>View Public Profile</span>
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* DASHBOARD LAYOUT: SIDEBAR + CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR NAVIGATION (3 cols) */}
        <div className="lg:col-span-3 space-y-2">
          <div className="p-4 rounded-2xl bg-[#101421] border border-white/10 space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-[#FF4FA3] to-[#FF8642] text-white shadow-neon-pink'
                  : 'text-[#A3A9BA] hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-[#FF4FA3] to-[#FF8642] text-white shadow-neon-pink'
                  : 'text-[#A3A9BA] hover:text-white hover:bg-white/5'
              }`}
            >
              <UserPen className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                activeTab === 'portfolio'
                  ? 'bg-gradient-to-r from-[#FF4FA3] to-[#FF8642] text-white shadow-neon-pink'
                  : 'text-[#A3A9BA] hover:text-white hover:bg-white/5'
              }`}
            >
              <Image className="w-4 h-4" />
              <span>My Portfolio ({portfolioItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('socials')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                activeTab === 'socials'
                  ? 'bg-gradient-to-r from-[#FF4FA3] to-[#FF8642] text-white shadow-neon-pink'
                  : 'text-[#A3A9BA] hover:text-white hover:bg-white/5'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Social Links ({socialLinks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-[#FF4FA3] to-[#FF8642] text-white shadow-neon-pink'
                  : 'text-[#A3A9BA] hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Account Settings</span>
            </button>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* MAIN PANEL CONTENT (9 cols) */}
        <div className="lg:col-span-9">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Overview stat metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-6 rounded-3xl bg-[#101421] border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase font-bold text-[#A3A9BA]">Total Followers</span>
                    <Users className="w-5 h-5 text-[#35DDF5]" />
                  </div>
                  <span className="font-anton text-4xl text-white">
                    {creatorProfile?.follower_count ? creatorProfile.follower_count.toLocaleString() : '342,500'}
                  </span>
                  <span className="text-[11px] text-[#35DDF5] block mt-1 font-semibold">
                    +1,420 this week
                  </span>
                </div>

                <div className="p-6 rounded-3xl bg-[#101421] border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase font-bold text-[#A3A9BA]">Profile Views</span>
                    <Eye className="w-5 h-5 text-[#FF4FA3]" />
                  </div>
                  <span className="font-anton text-4xl text-white">
                    {creatorProfile?.view_count ? creatorProfile.view_count.toLocaleString() : '1,890,000'}
                  </span>
                  <span className="text-[11px] text-[#FF4FA3] block mt-1 font-semibold">
                    +18.4% engagement
                  </span>
                </div>

                <div className="p-6 rounded-3xl bg-[#101421] border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase font-bold text-[#A3A9BA]">Published Items</span>
                    <Image className="w-5 h-5 text-[#FF9B61]" />
                  </div>
                  <span className="font-anton text-4xl text-white">
                    {portfolioItems.length}
                  </span>
                  <span className="text-[11px] text-[#FF9B61] block mt-1 font-semibold">
                    Portfolio Assets
                  </span>
                </div>
              </div>

              {/* Creator Card Preview */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#101421] border border-white/10">
                <h3 className="font-anton text-xl uppercase tracking-wider text-white mb-4">
                  Live Vanity Card Preview
                </h3>
                <div className="relative rounded-2xl bg-[#151B2B] border border-white/10 overflow-hidden max-w-md">
                  <div className="h-28 w-full bg-cover bg-center" style={{ backgroundImage: `url(${profileForm.cover_url || 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80'})` }} />
                  <div className="p-4 pt-0">
                    <div className="-mt-8 mb-2 flex items-end justify-between">
                      <img
                        src={profileForm.avatar_url || user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                        alt="avatar"
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-[#151B2B] ring-2 ring-[#FF4FA3]"
                      />
                      <span className="px-2.5 py-1 rounded-full bg-[#35DDF5]/20 text-[#35DDF5] text-[10px] font-bold uppercase">
                        Verified
                      </span>
                    </div>
                    <h4 className="font-anton text-lg uppercase text-white">{profileForm.display_name || user?.full_name}</h4>
                    <span className="text-xs text-[#FF4FA3] font-mono">@{user?.username}</span>
                    <p className="text-xs text-[#A3A9BA] mt-2 line-clamp-2">{profileForm.tagline || profileForm.bio}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EDIT PROFILE */}
          {activeTab === 'profile' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#101421] border border-white/10 space-y-6">
              <div>
                <h3 className="font-anton text-2xl uppercase tracking-wider text-white">
                  Edit Creator Identity
                </h3>
                <p className="text-xs text-[#A3A9BA] mt-1">
                  Updates reflect instantly on your public link-in-bio profile.
                </p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                
                {/* Media Uploads */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-white/10">
                  {/* Avatar Upload */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A3A9BA] mb-2">
                      Profile Picture (Avatar)
                    </label>
                    <div className="flex items-center gap-4">
                      <img
                        src={profileForm.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                        alt="Avatar preview"
                        className="w-16 h-16 rounded-2xl object-cover border border-white/15"
                      />
                      <label className="cursor-pointer px-4 py-2 rounded-xl bg-[#151B2B] hover:bg-white/10 border border-white/10 text-xs font-bold text-white uppercase tracking-wider inline-flex items-center gap-2 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Avatar</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'avatar')}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Cover Upload */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A3A9BA] mb-2">
                      Cover Banner (Vice Horizon)
                    </label>
                    <div className="flex items-center gap-4">
                      <img
                        src={profileForm.cover_url || 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=400&q=80'}
                        alt="Cover preview"
                        className="w-24 h-16 rounded-2xl object-cover border border-white/15"
                      />
                      <label className="cursor-pointer px-4 py-2 rounded-xl bg-[#151B2B] hover:bg-white/10 border border-white/10 text-xs font-bold text-white uppercase tracking-wider inline-flex items-center gap-2 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Cover</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'cover')}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Display Name & Tagline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A3A9BA] mb-1.5">
                      Display Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.display_name}
                      onChange={(e) => setProfileForm({ ...profileForm, display_name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#151B2B] border border-white/10 text-sm text-white focus:outline-none focus:border-[#FF4FA3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A3A9BA] mb-1.5">
                      Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Neon Tactical FPS & Vice City Nights"
                      value={profileForm.tagline}
                      onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#151B2B] border border-white/10 text-sm text-white focus:outline-none focus:border-[#FF4FA3]"
                    />
                  </div>
                </div>

                {/* Featured Game & Streaming Schedule */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A3A9BA] mb-1.5">
                      Featured Game Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. GTA VI"
                      value={profileForm.featured_game}
                      onChange={(e) => setProfileForm({ ...profileForm, featured_game: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#151B2B] border border-white/10 text-sm text-white focus:outline-none focus:border-[#FF4FA3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A3A9BA] mb-1.5">
                      Streaming Schedule
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mon/Wed/Fri 8:00 PM EST"
                      value={profileForm.streaming_schedule}
                      onChange={(e) => setProfileForm({ ...profileForm, streaming_schedule: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#151B2B] border border-white/10 text-sm text-white focus:outline-none focus:border-[#FF4FA3]"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A3A9BA] mb-1.5">
                    Bio & About Creator
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell your viewers and fans about your stream style, favorite mods, and creative projects..."
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#151B2B] border border-white/10 text-sm text-white focus:outline-none focus:border-[#FF4FA3]"
                  />
                </div>

                {/* Gaming Interests Tags Manager */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A3A9BA] mb-1.5">
                    Gaming Interests & Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Add tag (e.g. Cyberpunk 2077, Apex, Drift)..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                      className="flex-1 px-4 py-2 rounded-xl bg-[#151B2B] border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF4FA3]"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold uppercase"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {profileForm.gaming_interests.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#151B2B] border border-white/10 text-xs text-white"
                      >
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-white/40 hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#FF8642] text-white font-bold text-xs uppercase tracking-widest shadow-neon-pink hover:shadow-[0_0_30px_rgba(255,79,163,0.8)] transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: PORTFOLIO */}
          {activeTab === 'portfolio' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#101421] border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-anton text-2xl uppercase tracking-wider text-white">
                    Manage Portfolio Works
                  </h3>
                  <p className="text-xs text-[#A3A9BA] mt-1">
                    Showcase 3D graphics, stream concepts, and artwork on your profile.
                  </p>
                </div>
                <button
                  onClick={() => setShowPortfolioModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#FF8642] text-white font-bold text-xs uppercase tracking-wider shadow-neon-pink flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Portfolio Piece</span>
                </button>
              </div>

              {/* Items grid */}
              {portfolioItems.length === 0 ? (
                <div className="py-16 text-center rounded-2xl bg-[#151B2B] p-8 text-[#A3A9BA]">
                  <Image className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-sm">No portfolio items added yet. Click above to add your first work.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {portfolioItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl bg-[#151B2B] border border-white/10 overflow-hidden flex flex-col justify-between"
                    >
                      <div className="aspect-[16/10] w-full bg-[#080A12] overflow-hidden">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#35DDF5] uppercase block mb-1">
                            {item.category}
                          </span>
                          <h4 className="font-anton text-base uppercase text-white truncate">
                            {item.title}
                          </h4>
                        </div>
                        <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
                          <span className="text-xs text-[#A3A9BA]">{item.tags}</span>
                          <button
                            onClick={() => handleDeletePortfolio(item.id)}
                            className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SOCIAL LINKS */}
          {activeTab === 'socials' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#101421] border border-white/10 space-y-6">
              <div>
                <h3 className="font-anton text-2xl uppercase tracking-wider text-white">
                  Social & Channel Links
                </h3>
                <p className="text-xs text-[#A3A9BA] mt-1">
                  Connect your live Twitch, YouTube, Kick, Discord, and Instagram channels.
                </p>
              </div>

              {/* Add New Link Bar */}
              <div className="p-4 rounded-2xl bg-[#151B2B] border border-white/10 space-y-3">
                <span className="text-xs font-bold uppercase text-white tracking-wider block">
                  Add Channel
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-3">
                    <select
                      value={newSocial.platform}
                      onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#101421] border border-white/10 text-xs text-white"
                    >
                      <option value="twitch">Twitch</option>
                      <option value="youtube">YouTube</option>
                      <option value="kick">Kick</option>
                      <option value="discord">Discord</option>
                      <option value="x_twitter">X / Twitter</option>
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="steam">Steam</option>
                    </select>
                  </div>

                  <div className="sm:col-span-5">
                    <input
                      type="url"
                      placeholder="https://twitch.tv/yourchannel"
                      value={newSocial.url}
                      onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#101421] border border-white/10 text-xs text-white placeholder-white/30"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="Title / Label"
                      value={newSocial.title}
                      onChange={(e) => setNewSocial({ ...newSocial, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#101421] border border-white/10 text-xs text-white placeholder-white/30"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <button
                      type="button"
                      onClick={handleAddSocial}
                      className="w-full h-full py-2 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#FF8642] text-white flex items-center justify-center shadow-neon-pink"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Links list */}
              <div className="space-y-3">
                {socialLinks.map((link, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#151B2B] border border-white/5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#101421] text-[#35DDF5]">
                        {link.platform === 'twitch' && <Tv className="w-4 h-4 text-[#A855F7]" />}
                        {link.platform === 'youtube' && <Youtube className="w-4 h-4 text-[#FF4FA3]" />}
                        {link.platform === 'discord' && <MessageSquare className="w-4 h-4 text-[#35DDF5]" />}
                        {!['twitch', 'youtube', 'discord'].includes(link.platform) && (
                          <Share2 className="w-4 h-4 text-[#FF9B61]" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase text-white block">
                          {link.title || link.platform}
                        </span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-[#A3A9BA] hover:text-[#35DDF5] underline"
                        >
                          {link.url}
                        </a>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveSocial(idx)}
                      className="p-1.5 text-white/40 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSaveSocials}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#FF8642] text-white font-bold text-xs uppercase tracking-wider shadow-neon-pink flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Social Links</span>
              </button>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#101421] border border-white/10 space-y-6">
              <h3 className="font-anton text-2xl uppercase tracking-wider text-white">
                Account Information
              </h3>
              <div className="space-y-4 max-w-lg text-xs">
                <div>
                  <label className="text-[#A3A9BA] block mb-1">Username</label>
                  <input
                    type="text"
                    disabled
                    value={user?.username}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#151B2B] border border-white/5 text-white/60 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[#A3A9BA] block mb-1">Registered Email</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#151B2B] border border-white/5 text-white/60"
                  />
                </div>
                <div>
                  <label className="text-[#A3A9BA] block mb-1">Account Role</label>
                  <span className="inline-block px-3 py-1 rounded-lg bg-[#35DDF5]/15 text-[#35DDF5] font-bold uppercase text-[10px]">
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* PORTFOLIO MODAL */}
      {showPortfolioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-md w-full bg-[#101421] rounded-3xl border border-white/20 p-6 shadow-2xl relative">
            <button
              onClick={() => setShowPortfolioModal(false)}
              className="absolute top-4 right-4 p-2 text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-anton text-xl uppercase text-white mb-4">
              Add Portfolio Work
            </h3>
            <form onSubmit={handleAddPortfolio} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#A3A9BA] mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Neon Sunset 8K Render"
                  value={newPortfolio.title}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#151B2B] border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#A3A9BA] mb-1">Image URL or Upload</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newPortfolio.image_url}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, image_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#151B2B] border border-white/10 text-xs text-white mb-2"
                />
                <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#151B2B] hover:bg-white/10 border border-white/10 text-[11px] font-bold text-white uppercase inline-flex items-center gap-1.5">
                  <Upload className="w-3 h-3" />
                  <span>Upload Local Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'portfolio')}
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#A3A9BA] mb-1">Category</label>
                <select
                  value={newPortfolio.category}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#151B2B] border border-white/10 text-xs text-white"
                >
                  <option value="3D Artwork">3D Artwork</option>
                  <option value="Stream Overlay">Stream Overlay</option>
                  <option value="Print Poster">Print Poster</option>
                  <option value="UI Design">UI Design</option>
                  <option value="Digital Illustration">Digital Illustration</option>
                  <option value="Automotive Art">Automotive Art</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#A3A9BA] mb-1">Tags</label>
                <input
                  type="text"
                  placeholder="e.g. GTA VI, Neon, 8K"
                  value={newPortfolio.tags}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, tags: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#151B2B] border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#A3A9BA] mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Short note about software used, grading, resolution..."
                  value={newPortfolio.description}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#151B2B] border border-white/10 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#FF8642] text-white font-bold text-xs uppercase tracking-wider shadow-neon-pink"
              >
                {loading ? 'Adding...' : 'Publish to Portfolio'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
