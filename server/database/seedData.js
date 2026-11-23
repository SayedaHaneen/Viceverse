const seedData = {
  categories: [
    {
      name: "Gaming Wallpapers",
      slug: "gaming-wallpapers",
      description: "Ultra-high-definition 4K & 8K neon, synthwave and Vice City gaming desktop & mobile wallpapers.",
      icon: "Monitor",
      banner_image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      sort_order: 1
    },
    {
      name: "Gaming Posters",
      slug: "gaming-posters",
      description: "Print-ready cinematic gaming wall art, retro 80s arcade posters, and Vice City graphic prints.",
      icon: "Image",
      banner_image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
      sort_order: 2
    },
    {
      name: "Stream Overlays",
      slug: "stream-overlays",
      description: "Animated webcam frames, stinger transitions, chat boxes and alert packs for OBS, Twitch, and Kick.",
      icon: "Tv",
      banner_image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80",
      sort_order: 3
    },
    {
      name: "YouTube Thumbnails",
      slug: "youtube-thumbnails",
      description: "High-CTR, high-converting PSD & Figma thumbnail templates designed for GTA VI and FPS creators.",
      icon: "Film",
      banner_image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
      sort_order: 4
    },
    {
      name: "Channel Banners",
      slug: "channel-banners",
      description: "Multi-platform header suites for YouTube, Twitter/X, Discord, Kick, and Twitch channels.",
      icon: "Layout",
      banner_image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80",
      sort_order: 5
    },
    {
      name: "Profile Themes",
      slug: "profile-themes",
      description: "Complete visual identity packages including avatars, badges, color palettes, and stream graphics.",
      icon: "Palette",
      banner_image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
      sort_order: 6
    }
  ],

  users: [
    {
      id: 1,
      full_name: "ViceVerse Administrator",
      username: "viceadmin",
      email: "admin@viceverse.gg",
      password_hash: "$2a$10$kDQcny8ogMjA3kaa8labkuvComL5Os8TKlkW/bomIvGqgWT2v7Pta",
      role: "admin",
      avatar_url: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80",
      bio: "Official ViceVerse Platform Architect & Master Administrator."
    },
    {
      id: 2,
      full_name: "Maya Torres",
      username: "neonvalkyrie",
      email: "neon@viceverse.gg",
      password_hash: "$2a$10$xQwsmZ0w8rc6EJo0qdmMo.fCOBGHjC/g/GgCtFM8wSpKKiFXVzxse",
      role: "creator",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
      bio: "Vice City born & raised. Partnered Twitch streamer, competitive FPS grinder and 3D synthwave artist."
    },
    {
      id: 3,
      full_name: "Tommy Vance",
      username: "tommyvibe",
      email: "tommy@viceverse.gg",
      password_hash: "$2a$10$xQwsmZ0w8rc6EJo0qdmMo.fCOBGHjC/g/GgCtFM8wSpKKiFXVzxse",
      role: "creator",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
      bio: "Ocean Drive nightclub roleplay host, GTA VI lore researcher, and retro arcade collector."
    },
    {
      id: 4,
      full_name: "Kai Sterling",
      username: "apexphantom",
      email: "phantom@viceverse.gg",
      password_hash: "$2a$10$xQwsmZ0w8rc6EJo0qdmMo.fCOBGHjC/g/GgCtFM8wSpKKiFXVzxse",
      role: "creator",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
      bio: "Esports predator, cyber-tactics streamer and Motion Graphics designer creating high-speed stream assets."
    },
    {
      id: 5,
      full_name: "Elena Rostova",
      username: "cybervixen",
      email: "cyber@viceverse.gg",
      password_hash: "$2a$10$xQwsmZ0w8rc6EJo0qdmMo.fCOBGHjC/g/GgCtFM8wSpKKiFXVzxse",
      role: "creator",
      avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80",
      bio: "Synthwave composer, retro speedrunner, and neon digital wallpaper creator. Night city is my playground."
    },
    {
      id: 6,
      full_name: "Marcus Chen",
      username: "vicedrifter",
      email: "drift@viceverse.gg",
      password_hash: "$2a$10$xQwsmZ0w8rc6EJo0qdmMo.fCOBGHjC/g/GgCtFM8wSpKKiFXVzxse",
      role: "creator",
      avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=80",
      bio: "Midnight Touge & South Beach drag racing streamer. 3D automotive modeler and custom vehicle skin creator."
    },
    {
      id: 7,
      full_name: "Zara Nova",
      username: "glitchkween",
      email: "zara@viceverse.gg",
      password_hash: "$2a$10$xQwsmZ0w8rc6EJo0qdmMo.fCOBGHjC/g/GgCtFM8wSpKKiFXVzxse",
      role: "creator",
      avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
      bio: "VFX artist, VTuber rigger, and full-spectrum stream package architect. Crafting immersive cyberpunk visual identities."
    },
    {
      id: 8,
      full_name: "Leo Brooks",
      username: "hypernova",
      email: "nova@viceverse.gg",
      password_hash: "$2a$10$xQwsmZ0w8rc6EJo0qdmMo.fCOBGHjC/g/GgCtFM8wSpKKiFXVzxse",
      role: "creator",
      avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80",
      bio: "FPS coach, tournament caster and thumbnail optimization engineer. Elevating streamers to 7-figure views."
    },
    {
      id: 9,
      full_name: "Jack Kane",
      username: "midnightrider",
      email: "outlaw@viceverse.gg",
      password_hash: "$2a$10$xQwsmZ0w8rc6EJo0qdmMo.fCOBGHjC/g/GgCtFM8wSpKKiFXVzxse",
      role: "creator",
      avatar_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=500&q=80",
      bio: "Open-world outlaw cruiser. Heavy metal soundtrack enthusiast and high-contrast poster illustrator."
    },
    {
      id: 10,
      full_name: "Alex Mercer",
      username: "player1",
      email: "player1@viceverse.gg",
      password_hash: "$2a$10$/ZGY.3b9qB6e9TEh9g9GsuDwyFOCDj6a21TwSeNEZ3JMA3fkwkMCq",
      role: "user",
      avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
      bio: "Gamer, digital asset collector and aspiring Vice City streamer."
    }
  ],

  creator_profiles: [
    {
      user_id: 2,
      display_name: "Maya 'Valk' Torres",
      tagline: "Neon-Drenched Tactical FPS & Vice City Nights",
      bio: "Miami native streaming competitive tactical shooters and GTA VI roleplay. I design my own high-contrast neon graphics, OBS overlays, and 4K synthwave wallpapers. Welcome to the district.",
      cover_url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1600&q=80",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
      banner_color: "#FF4FA3",
      gaming_interests: JSON.stringify(["GTA VI", "Valorant", "Cyberpunk 2077", "Apex Legends"]),
      featured_game: "GTA VI",
      streaming_schedule: "Mon/Wed/Fri 7:00 PM EST",
      follower_count: 342500,
      view_count: 1890000,
      is_verified: true,
      is_featured: true
    },
    {
      user_id: 3,
      display_name: "Tommy Vibe",
      tagline: "Ocean Drive Roleplay & Malibu Club Vibes",
      bio: "Living the 1986 neon dream in modern Leonida. Streamer, podcast host, and graphic designer specializing in retro tropical artwork and VHS stream transitions.",
      cover_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
      banner_color: "#35DDF5",
      gaming_interests: JSON.stringify(["GTA VI", "GTA RP", "Hotline Miami", "Need for Speed"]),
      featured_game: "GTA VI Roleplay",
      streaming_schedule: "Tue/Thu/Sat 9:00 PM EST",
      follower_count: 521000,
      view_count: 4200000,
      is_verified: true,
      is_featured: true
    },
    {
      user_id: 4,
      display_name: "Kai 'Phantom' Sterling",
      tagline: "Precision Aim. Cybernetic Overlays. Maximum Velocity.",
      bio: "Apex Predator & Warzone champion with an obsession for sleek sci-fi aesthetics. I build minimal, performance-optimized stream overlays for competitive grinders.",
      cover_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
      banner_color: "#FF9B61",
      gaming_interests: JSON.stringify(["Apex Legends", "Call of Duty", "Overwatch 2", "GTA VI"]),
      featured_game: "Apex Legends",
      streaming_schedule: "Daily 6:00 PM EST",
      follower_count: 214000,
      view_count: 1100000,
      is_verified: true,
      is_featured: true
    },
    {
      user_id: 5,
      display_name: "Elena 'CyberVixen'",
      tagline: "Synthwave Soundscapes & High-Voltage Gaming Art",
      bio: "Electronic music producer and digital illustrator. Crafting 8K OLED wallpaper packs and atmospheric retro-wave stream suites designed to give your stream unforgettable ambiance.",
      cover_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80",
      avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80",
      banner_color: "#FF4FA3",
      gaming_interests: JSON.stringify(["Cyberpunk 2077", "GTA VI", "Ghostrunner", "The Witcher 3"]),
      featured_game: "Cyberpunk 2077",
      streaming_schedule: "Wed/Fri/Sun 8:00 PM CET",
      follower_count: 418000,
      view_count: 2650000,
      is_verified: true,
      is_featured: true
    },
    {
      user_id: 6,
      display_name: "Marcus Chen",
      tagline: "Midnight Drifts & Neon Supercar Culture",
      bio: "Assetto Corsa and open world automotive creator. Specializing in high-octane vehicular wallpapers, animated gauge stream widgets, and high-gloss 3D liveries.",
      cover_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
      avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=80",
      banner_color: "#35DDF5",
      gaming_interests: JSON.stringify(["Assetto Corsa", "Forza Horizon", "GTA VI", "Gran Turismo"]),
      featured_game: "Assetto Corsa EVO",
      streaming_schedule: "Mon/Wed/Sat 8:30 PM PST",
      follower_count: 185000,
      view_count: 980000,
      is_verified: true,
      is_featured: false
    },
    {
      user_id: 7,
      display_name: "Zara 'GlitchKween' Nova",
      tagline: "Next-Gen VTuber Assets & Kinetic Motion Design",
      bio: "Motion designer crafting animated alerts, dynamic reactive stinger transitions, and full cyber-aesthetic channel packages for rising streamers and content creators.",
      cover_url: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1600&q=80",
      avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
      banner_color: "#A855F7",
      gaming_interests: JSON.stringify(["Valorant", "GTA VI", "League of Legends", "Genshin Impact"]),
      featured_game: "Valorant",
      streaming_schedule: "Thu/Fri/Sun 7:00 PM EST",
      follower_count: 295000,
      view_count: 1740000,
      is_verified: true,
      is_featured: true
    },
    {
      user_id: 8,
      display_name: "Leo 'HyperNova' Brooks",
      tagline: "Esports Caster & High-CTR Thumbnail Architect",
      bio: "Former professional tournament analyst helping creators scale. I design viral YouTube thumbnail packs and multi-format social headers engineered for maximum clicks.",
      cover_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80",
      avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80",
      banner_color: "#FF9B61",
      gaming_interests: JSON.stringify(["Call of Duty", "Counter-Strike 2", "GTA VI", "Fortnite"]),
      featured_game: "Call of Duty: Warzone",
      streaming_schedule: "Mon/Tue/Thu 5:00 PM CST",
      follower_count: 178000,
      view_count: 1320000,
      is_verified: true,
      is_featured: false
    },
    {
      user_id: 9,
      display_name: "Jack 'Outlaw' Kane",
      tagline: "Chopper Cruising & Gritty Vice City Storylines",
      bio: "Riding across the state line. Deep dives into open-world crime sagas, retro rock anthems, and limited edition illustrated posters with that classic Vice City grit.",
      cover_url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1600&q=80",
      avatar_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=500&q=80",
      banner_color: "#FF4FA3",
      gaming_interests: JSON.stringify(["GTA VI", "Red Dead Redemption 2", "Days Gone", "Cyberpunk 2077"]),
      featured_game: "GTA VI Story Mode",
      streaming_schedule: "Fri/Sat/Sun 10:00 PM EST",
      follower_count: 312000,
      view_count: 2200000,
      is_verified: true,
      is_featured: false
    }
  ],

  social_links: [
    // Maya Torres
    { creator_profile_id: 1, platform: "twitch", url: "https://twitch.tv/neonvalkyrie", title: "Twitch Live Stream", is_primary: true },
    { creator_profile_id: 1, platform: "youtube", url: "https://youtube.com/@neonvalkyrie", title: "YouTube Highlights", is_primary: false },
    { creator_profile_id: 1, platform: "discord", url: "https://discord.gg/valkyrie-hub", title: "Valkyrie Discord", is_primary: false },
    { creator_profile_id: 1, platform: "x_twitter", url: "https://twitter.com/neonvalk", title: "X / Twitter", is_primary: false },

    // Tommy Vibe
    { creator_profile_id: 2, platform: "twitch", url: "https://twitch.tv/tommyvibe", title: "Twitch Nightclub RP", is_primary: true },
    { creator_profile_id: 2, platform: "youtube", url: "https://youtube.com/@tommyvibe", title: "Vice City Chronicles", is_primary: false },
    { creator_profile_id: 2, platform: "kick", url: "https://kick.com/tommyvibe", title: "Kick Late Night", is_primary: false },
    { creator_profile_id: 2, platform: "instagram", url: "https://instagram.com/tommyvibes", title: "Instagram Photos", is_primary: false },

    // Kai Sterling
    { creator_profile_id: 3, platform: "twitch", url: "https://twitch.tv/apexphantom", title: "Rank 1 Predator Stream", is_primary: true },
    { creator_profile_id: 3, platform: "youtube", url: "https://youtube.com/@apexphantom", title: "Guides & Montages", is_primary: false },
    { creator_profile_id: 3, platform: "discord", url: "https://discord.gg/phantomcorps", title: "Phantom Squad Discord", is_primary: false },

    // Elena Rostova
    { creator_profile_id: 4, platform: "youtube", url: "https://youtube.com/@cybervixen", title: "Synthwave Visuals", is_primary: true },
    { creator_profile_id: 4, platform: "twitch", url: "https://twitch.tv/cybervixen", title: "Retro Speedruns", is_primary: false },
    { creator_profile_id: 4, platform: "x_twitter", url: "https://twitter.com/cybervixen", title: "Design Drops", is_primary: false },

    // Marcus Chen
    { creator_profile_id: 5, platform: "youtube", url: "https://youtube.com/@vicedrifter", title: "Touge & Drag Builds", is_primary: true },
    { creator_profile_id: 5, platform: "twitch", url: "https://twitch.tv/vicedrifter", title: "Sim Rig Live", is_primary: false },

    // Zara Nova
    { creator_profile_id: 6, platform: "twitch", url: "https://twitch.tv/glitchkween", title: "Live Art & Rigging", is_primary: true },
    { creator_profile_id: 6, platform: "discord", url: "https://discord.gg/glitchlab", title: "Creator Resource Discord", is_primary: false },

    // Leo Brooks
    { creator_profile_id: 7, platform: "youtube", url: "https://youtube.com/@hypernova", title: "Meta Breakdowns", is_primary: true },
    { creator_profile_id: 7, platform: "x_twitter", url: "https://twitter.com/hypernovafps", title: "Esports Updates", is_primary: false },

    // Jack Kane
    { creator_profile_id: 8, platform: "kick", url: "https://kick.com/midnightrider", title: "Outlaw Rides Live", is_primary: true },
    { creator_profile_id: 8, platform: "youtube", url: "https://youtube.com/@midnightrider", title: "Story Walkthroughs", is_primary: false }
  ],

  portfolio_items: [
    {
      creator_profile_id: 1,
      title: "Vice District Neon Sunset 8K",
      description: "Custom 3D render created in Blender and graded in Photoshop for the GTA VI launch celebration.",
      image_url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80",
      category: "3D Artwork",
      tags: "GTA VI, Neon, 8K, Sunset",
      view_count: 14500,
      likes_count: 1240
    },
    {
      creator_profile_id: 1,
      title: "Miami Horizon Glitch Suite",
      description: "Interactive stream overlay kit with custom sound triggers and animated camera borders.",
      image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      category: "Stream Overlay",
      tags: "Twitch, OBS, Glitch, Miami",
      view_count: 9800,
      likes_count: 850
    },
    {
      creator_profile_id: 2,
      title: "Malibu Club 1986 Flyer Poster",
      description: "Authentic 80s lithograph poster design celebrating the golden era of Vice City nightlife.",
      image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
      category: "Print Poster",
      tags: "Retro, Synthwave, 1980s, Vice",
      view_count: 22100,
      likes_count: 2100
    },
    {
      creator_profile_id: 3,
      title: "Cybernetic HUD Stream Frame",
      description: "Minimalist sci-fi stream frame designed for competitive 240Hz monitors with zero GPU impact.",
      image_url: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80",
      category: "UI Design",
      tags: "Esports, Minimal, HUD, Cyber",
      view_count: 11200,
      likes_count: 970
    },
    {
      creator_profile_id: 4,
      title: "Electric Highway Synthwave Scene",
      description: "High-contrast loop created for lofi synthwave gaming background and desktop wallpapers.",
      image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
      category: "Digital Illustration",
      tags: "Synthwave, Retrowave, Neon",
      view_count: 18400,
      likes_count: 1650
    },
    {
      creator_profile_id: 5,
      title: "Midnight South Beach Supercar Shoot",
      description: "Cinematic automotive visual featuring custom midnight purple wrap under Biscayne neon lights.",
      image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      category: "Automotive Art",
      tags: "Supercars, Drift, Vice City",
      view_count: 8900,
      likes_count: 730
    }
  ],

  products: [
    {
      seller_id: 2, // Maya Torres
      category_id: 1, // Gaming Wallpapers
      title: "Vice Lights 8K OLED Wallpaper Pack",
      slug: "vice-lights-8k-oled-wallpaper-pack",
      description: "A breathtaking collection of 12 ultra-high-definition wallpapers designed specifically for OLED and ultrawide displays. Features deep blacks, electric pinks, cyan halos, and cinematic Vice City coastal skylines.",
      price: 14.99,
      original_price: 24.99,
      preview_image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1000&q=80",
      thumbnail_images: JSON.stringify([
        "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80"
      ]),
      file_type: "ZIP (12x PNG 8K 7680x4320)",
      file_size_mb: 185.40,
      download_url: "/downloads/vice-lights-8k.zip",
      tags: "4K, 8K, OLED, Vice City, Neon, GTA VI",
      is_featured: true,
      is_trending: true,
      sales_count: 482,
      rating: 4.95
    },
    {
      seller_id: 2, // Maya Torres
      category_id: 3, // Stream Overlays
      title: "Vice Neon Complete Animated Stream Pack",
      slug: "vice-neon-complete-animated-stream-pack",
      description: "Everything you need to turn your Twitch, Kick, or YouTube stream into a GTA VI broadcast. Includes animated webcam borders, starting soon / BRB / ending screens, 10 stinger transitions, modular chat boxes, and custom sound alerts.",
      price: 34.99,
      original_price: 49.99,
      preview_image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80",
      thumbnail_images: JSON.stringify([
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80"
      ]),
      file_type: "OBS / Streamlabs Package (.overlay)",
      file_size_mb: 420.00,
      download_url: "/downloads/vice-neon-stream-pack.zip",
      tags: "OBS, Streamlabs, Twitch, Animated, Webcam, Transitions",
      is_featured: true,
      is_trending: true,
      sales_count: 819,
      rating: 4.98
    },
    {
      seller_id: 3, // Tommy Vibe
      category_id: 2, // Gaming Posters
      title: "Leonida Sunset Retro Arcade Print (300 DPI)",
      slug: "leonida-sunset-retro-arcade-print",
      description: "Museum-grade printable poster capturing the palm trees, pastel pink sunset, and luxury cruisers of Vice City. Sized at 24x36 inches with 300 DPI CMYK ready for framing.",
      price: 19.99,
      original_price: 29.99,
      preview_image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80",
      thumbnail_images: JSON.stringify([
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80"
      ]),
      file_type: "TIFF & PDF Print Ready (300 DPI)",
      file_size_mb: 95.00,
      download_url: "/downloads/leonida-sunset-poster.zip",
      tags: "Print, Poster, 300DPI, Synthwave, GTA VI",
      is_featured: true,
      is_trending: false,
      sales_count: 275,
      rating: 4.88
    },
    {
      seller_id: 4, // Kai Sterling
      category_id: 3, // Stream Overlays
      title: "CyberGhost Minimal Tactical HUD Overlay",
      slug: "cyberghost-minimal-tactical-hud-overlay",
      description: "Engineered for high-rank competitive players who demand maximum screen real estate with crisp cyan telemetry indicators. Zero lag, ultra-clean design.",
      price: 24.99,
      original_price: 34.99,
      preview_image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1000&q=80",
      thumbnail_images: JSON.stringify([
        "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80"
      ]),
      file_type: "WebM / PNG Assets",
      file_size_mb: 78.50,
      download_url: "/downloads/cyberghost-hud.zip",
      tags: "Tactical, Minimal, Apex, FPS, Cyan",
      is_featured: false,
      is_trending: true,
      sales_count: 614,
      rating: 4.92
    },
    {
      seller_id: 8, // Leo Brooks
      category_id: 4, // YouTube Thumbnails
      title: "GTA VI Viral Click-Engine Thumbnail Kit (PSD + Figma)",
      slug: "gta-vi-viral-click-engine-thumbnail-kit",
      description: "15 master PSD and Figma templates tested across 5 million YouTube impressions. Includes editable bold 3D text styles, character cutouts, glowing badges, and color grading LUTs.",
      price: 19.99,
      original_price: 39.99,
      preview_image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80",
      thumbnail_images: JSON.stringify([
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80"
      ]),
      file_type: "PSD & Figma Editable Files",
      file_size_mb: 290.00,
      download_url: "/downloads/viral-thumbnail-kit.zip",
      tags: "YouTube, Thumbnails, High CTR, Photoshop, Figma",
      is_featured: true,
      is_trending: true,
      sales_count: 1140,
      rating: 4.97
    },
    {
      seller_id: 5, // Elena Rostova
      category_id: 1, // Gaming Wallpapers
      title: "Synthwave Nightfall Ultrawide 32:9 Wallpapers",
      slug: "synthwave-nightfall-ultrawide-wallpapers",
      description: "Tailored specifically for 5120x1440 and 3840x1080 curved panoramic battlestations. Glorious neon wireframe grids, retro sports cars, and twilight palm silhouettes.",
      price: 12.99,
      original_price: 19.99,
      preview_image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80",
      thumbnail_images: JSON.stringify([
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80"
      ]),
      file_type: "PNG Ultrawide 32:9",
      file_size_mb: 135.00,
      download_url: "/downloads/synthwave-ultrawide.zip",
      tags: "Ultrawide, 32:9, Synthwave, Retrowave, Battlestation",
      is_featured: false,
      is_trending: true,
      sales_count: 530,
      rating: 4.89
    },
    {
      seller_id: 7, // Zara Nova
      category_id: 5, // Channel Banners
      title: "Vice Sovereign Multi-Platform Banner Suite",
      slug: "vice-sovereign-multi-platform-banner-suite",
      description: "Cohesive branding bundle for YouTube headers, Twitch offline & header art, Kick banner, Twitter/X header, and Discord server banner. Easily customize with smart objects.",
      price: 16.99,
      original_price: 25.00,
      preview_image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1000&q=80",
      thumbnail_images: JSON.stringify([
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80"
      ]),
      file_type: "Photoshop (.PSD) + Vector (.AI)",
      file_size_mb: 110.00,
      download_url: "/downloads/vice-sovereign-banners.zip",
      tags: "Banners, Twitch, YouTube, Kick, Discord, Branding",
      is_featured: false,
      is_trending: false,
      sales_count: 310,
      rating: 4.85
    },
    {
      seller_id: 6, // Marcus Chen
      category_id: 6, // Profile Themes
      title: "Midnight Touge OBS & Twitch Complete Profile Theme",
      slug: "midnight-touge-obs-profile-theme",
      description: "A dark automotive street-racing theme featuring high-gloss carbon fiber textures, purple neon underglow accents, sound reactive rev gauges, and responsive chat widgets.",
      price: 29.99,
      original_price: 45.00,
      preview_image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80",
      thumbnail_images: JSON.stringify([
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80"
      ]),
      file_type: "Full Theme Bundle (OBS/HTML/CSS)",
      file_size_mb: 215.00,
      download_url: "/downloads/midnight-touge-theme.zip",
      tags: "Theme, OBS, Racing, Drift, Carbon, Violet",
      is_featured: true,
      is_trending: false,
      sales_count: 412,
      rating: 4.91
    },
    {
      seller_id: 9, // Jack Kane
      category_id: 2, // Gaming Posters
      title: "Vice Outlaw Highway Screenprint Edition",
      slug: "vice-outlaw-highway-screenprint-edition",
      description: "Grungy, retro-modern vector screenprint artwork showing a lone chopper cruising into the Leonida neon horizon. Includes dark mode and sunset variants.",
      price: 18.50,
      original_price: 28.00,
      preview_image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80",
      thumbnail_images: JSON.stringify([
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80"
      ]),
      file_type: "High-Res PDF & Vector EPS",
      file_size_mb: 64.00,
      download_url: "/downloads/outlaw-highway-poster.zip",
      tags: "Poster, Motorcycle, Screenprint, Outlaw, Vice City",
      is_featured: false,
      is_trending: false,
      sales_count: 198,
      rating: 4.80
    },
    {
      seller_id: 7, // Zara Nova
      category_id: 3, // Stream Overlays
      title: "Glitch Cyberpunk Reactive Chat & Alert Package",
      slug: "glitch-cyberpunk-reactive-chat-alert-package",
      description: "Browser-source compatible HTML5/CSS3 dynamic twitch alerts and animated chat box. Automatically reacts to subs, bits, raids, and donations with custom neon explosions.",
      price: 21.00,
      original_price: 30.00,
      preview_image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80",
      thumbnail_images: JSON.stringify([
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80"
      ]),
      file_type: "HTML5 / CSS / JS Widget",
      file_size_mb: 45.00,
      download_url: "/downloads/glitch-reactive-alerts.zip",
      tags: "Alerts, Twitch, Kick, HTML5, Reactive, StreamElements",
      is_featured: false,
      is_trending: true,
      sales_count: 730,
      rating: 4.96
    },
    {
      seller_id: 8, // Leo Brooks
      category_id: 4, // YouTube Thumbnails
      title: "Esports Tournament Victory Thumbnail Bundle",
      slug: "esports-tournament-victory-thumbnail-bundle",
      description: "10 high-impact thumbnail templates built for competitive victory moments, clutch breakdowns, and tier lists. Easy drag-and-drop player face cutouts.",
      price: 15.00,
      original_price: 22.00,
      preview_image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80",
      thumbnail_images: JSON.stringify([
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80"
      ]),
      file_type: "Photoshop PSD",
      file_size_mb: 180.00,
      download_url: "/downloads/esports-thumbnail-bundle.zip",
      tags: "Esports, Victory, Clutch, FPS, Thumbnails",
      is_featured: false,
      is_trending: false,
      sales_count: 360,
      rating: 4.87
    },
    {
      seller_id: 2, // Maya Torres
      category_id: 6, // Profile Themes
      title: "Vice Deluxe Pink & Cyan Complete Creator Branding Kit",
      slug: "vice-deluxe-pink-cyan-creator-branding-kit",
      description: "The ultimate flagship branding suite for ambitious gaming creators. Includes 3D avatar frames, social media banners, lower thirds, stream overlays, sound pack, and font recommendations.",
      price: 49.99,
      original_price: 79.99,
      preview_image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1000&q=80",
      thumbnail_images: JSON.stringify([
        "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80"
      ]),
      file_type: "Master Archive (AI / PSD / AE / OBS)",
      file_size_mb: 750.00,
      download_url: "/downloads/vice-deluxe-kit.zip",
      tags: "All-in-One, Branding, Twitch, Kick, YouTube, Master",
      is_featured: true,
      is_trending: true,
      sales_count: 954,
      rating: 4.99
    }
  ]
};

module.exports = seedData;
