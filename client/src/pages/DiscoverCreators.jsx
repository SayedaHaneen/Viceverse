import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import CreatorCard from '../components/CreatorCard';
import { 
  Search, 
  Compass, 
  Users, 
  Sparkles, 
  MapPin, 
  Building2, 
  Palmtree, 
  Zap, 
  Flame, 
  ArrowRight,
  Tv,
  Star
} from 'lucide-react';

const DISTRICTS = [
  { id: 'all', name: 'All Districts', vibe: 'Whole Leonida Metro', icon: Compass, color: '#35DDF5' },
  { id: 'downtown', name: 'Downtown', vibe: 'FPS & Tactical Esports', icon: Building2, color: '#35DDF5' },
  { id: 'ocean-beach', name: 'Ocean Beach', vibe: 'GTA VI & Open World RP', icon: Palmtree, color: '#FF4FA3' },
  { id: 'neon-district', name: 'Neon District', vibe: 'Synthwave & Cyberpunk', icon: Zap, color: '#A855F7' },
  { id: 'sunset-blvd', name: 'Sunset Boulevard', vibe: 'Sim Racing & Speed', icon: Flame, color: '#FF9B61' },
];

const CATEGORIES = [
  { label: 'All Games', value: 'all' },
  { label: 'GTA VI', value: 'GTA VI' },
  { label: 'Apex Legends', value: 'Apex' },
  { label: 'Cyberpunk 2077', value: 'Cyberpunk' },
  { label: 'Valorant', value: 'Valorant' },
  { label: 'Call of Duty', value: 'Call of Duty' },
  { label: 'Assetto Corsa / Sim Racing', value: 'Assetto' },
];

export default function DiscoverCreators() {
  const [creators, setCreators] = useState([]);
  const [featuredSpotlight, setFeaturedSpotlight] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    async function fetchCreators() {
      setLoading(true);
      try {
        const res = await api.getCreators({
          search,
          category: selectedCategory,
          sort,
        });
        if (res.success) {
          setCreators(res.creators);
          if (res.creators.length > 0 && featuredSpotlight.length === 0) {
            setFeaturedSpotlight(res.creators.filter(c => c.is_featured).slice(0, 3));
          }
        }
      } catch (err) {
        console.error('Failed to load creators:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(fetchCreators, 250);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, sort]);

  // Filter creators based on selected Vice City District
  const filteredCreators = creators.filter((c) => {
    if (selectedDistrict === 'all') return true;
    const game = (c.featured_game || '').toLowerCase();
    const interests = (Array.isArray(c.gaming_interests) ? c.gaming_interests.join(' ') : (c.gaming_interests || '')).toLowerCase();
    const combined = `${game} ${interests} ${(c.bio || '')}`.toLowerCase();

    if (selectedDistrict === 'downtown') {
      return combined.includes('apex') || combined.includes('valorant') || combined.includes('call of duty') || combined.includes('warzone') || combined.includes('strike');
    }
    if (selectedDistrict === 'ocean-beach') {
      return combined.includes('gta') || combined.includes('roleplay') || combined.includes('rp') || combined.includes('outlaw');
    }
    if (selectedDistrict === 'neon-district') {
      return combined.includes('cyberpunk') || combined.includes('ghostrunner') || combined.includes('witcher') || combined.includes('glitch');
    }
    if (selectedDistrict === 'sunset-blvd') {
      return combined.includes('assetto') || combined.includes('forza') || combined.includes('racing') || combined.includes('drift') || combined.includes('turismo');
    }
    return true;
  });

  return (
    <div className="min-h-screen text-white pb-24">
      
      {/* ========================================================
          CINEMATIC BANNER HEADER (VICE CITY / LEONIDA SKYLINE)
      ======================================================== */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(8,10,18,0.75), rgba(8,10,18,0.95)), url('/assets/gta6/gta6-hero-sunset.jpg')`
        }}
      >
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF2A85]/20 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#35DDF5]/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A0B20]/90 border border-[#FF4FA3]/40 text-[#FFE2EC] text-xs font-bold uppercase tracking-[0.2em] mb-4 shadow-[0_0_20px_rgba(255,42,133,0.3)]">
              <Compass className="w-3.5 h-3.5 text-[#35DDF5]" /> Leonida Creator Network
            </div>
            <h1 className="font-anton text-4xl sm:text-5xl lg:text-7xl uppercase tracking-wide text-white leading-none">
              DISCOVER <span className="gta6-gradient-text">GAMING TALENT</span>
            </h1>
            <p className="text-sm sm:text-base text-white/80 mt-3 max-w-2xl leading-relaxed font-normal">
              Explore verified gaming streamers, 3D artists, and content grinders living in the ViceVerse universe. Browse by district, game category, or stream vibes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-5 py-3 rounded-2xl bg-[#121626]/90 border border-white/15 text-xs font-semibold text-white/90 flex items-center gap-2.5 backdrop-blur-md shadow-xl">
              <Users className="w-4 h-4 text-[#35DDF5]" />
              <span><strong>{filteredCreators.length}</strong> Streamers Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* ========================================================
            VICE CITY DISTRICTS SELECTOR
        ======================================================== */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-xs uppercase font-extrabold tracking-[0.22em] text-[#FFE2EC] flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#FF4FA3]" /> Explore by Vice City District
            </span>
            <span className="text-[11px] text-[#A3A9BA]">
              Filter creators by metropolitan region & aesthetic
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {DISTRICTS.map((district) => {
              const Icon = district.icon;
              const isSelected = selectedDistrict === district.id;
              return (
                <button
                  key={district.id}
                  onClick={() => setSelectedDistrict(district.id)}
                  className={`p-4 rounded-2xl text-left transition-all duration-300 relative overflow-hidden group ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#241232] to-[#14192B] border-2 border-[#FF4FA3] shadow-[0_0_25px_rgba(255,79,163,0.4)] -translate-y-1'
                      : 'bg-[#121626]/85 hover:bg-[#1A1F36] border border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${isSelected ? 'bg-[#FF4FA3]/25 text-[#FF4FA3]' : 'bg-white/5 text-white/70 group-hover:text-white'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className={`font-anton text-sm uppercase tracking-wide ${isSelected ? 'text-white' : 'text-[#DFE4F0]'}`}>
                      {district.name}
                    </h4>
                  </div>
                  <p className="text-[10px] text-[#A3A9BA] line-clamp-1 font-medium pl-0.5">
                    {district.vibe}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            SEARCH AND GAME FILTER TOOLBAR
        ======================================================== */}
        <div className="space-y-4 mb-10 p-5 rounded-2xl bg-[#121626]/80 border border-white/10 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search creators by username, display name, game or bio..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#181E32] border border-white/10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#35DDF5] transition-all shadow-inner"
              />
            </div>

            {/* Sort Selector */}
            <div className="sm:w-60">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-[#181E32] border border-white/10 text-sm text-white focus:outline-none focus:border-[#35DDF5] cursor-pointer"
              >
                <option value="featured">Featured / Top Tier</option>
                <option value="followers">Most Followers</option>
                <option value="views">Most Channel Views</option>
                <option value="name">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat.value
                    ? 'bg-gradient-to-r from-[#FF4FA3] via-[#FF7582] to-[#FF8642] text-white shadow-neon-pink'
                    : 'bg-[#181E32] border border-white/10 text-[#A3A9BA] hover:text-white hover:border-white/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================
            CREATORS GRID
        ======================================================== */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-[#151B2B] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : filteredCreators.length === 0 ? (
          <div className="py-24 text-center rounded-3xl bg-[#121626]/90 border border-white/10 p-8 max-w-lg mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[#181E32] flex items-center justify-center text-white/30 mx-auto mb-4">
              <Compass className="w-8 h-8" />
            </div>
            <h3 className="font-anton text-2xl uppercase text-white mb-2">No creators found</h3>
            <p className="text-xs text-[#A3A9BA] mb-6">
              Try adjusting your search terms, switching districts, or selecting a different game category.
            </p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('all'); setSelectedDistrict('all'); }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#FF8642] text-white font-anton text-sm uppercase tracking-wider shadow-neon-pink hover:scale-105 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCreators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
