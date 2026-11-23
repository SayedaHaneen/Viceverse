const db = require('../config/db');

// GET ALL CREATORS (DISCOVERY)
async function getCreators(req, res) {
  try {
    const { search, category, featured, sort } = req.query;

    let queryStr = `
      SELECT 
        cp.id,
        cp.user_id,
        cp.display_name,
        cp.tagline,
        cp.bio,
        cp.cover_url,
        cp.avatar_url,
        cp.banner_color,
        cp.gaming_interests,
        cp.featured_game,
        cp.streaming_schedule,
        cp.follower_count,
        cp.view_count,
        cp.is_verified,
        cp.is_featured,
        u.username,
        u.email
      FROM creator_profiles cp
      JOIN users u ON cp.user_id = u.id
      WHERE 1=1
    `;

    const params = [];

    if (search && search.trim() !== '') {
      queryStr += ` AND (cp.display_name LIKE ? OR u.username LIKE ? OR cp.bio LIKE ? OR cp.gaming_interests LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    if (category && category !== 'all') {
      queryStr += ` AND (cp.gaming_interests LIKE ? OR cp.featured_game LIKE ?)`;
      const catTerm = `%${category}%`;
      params.push(catTerm, catTerm);
    }

    if (featured === 'true' || featured === '1') {
      queryStr += ` AND cp.is_featured = 1`;
    }

    // Sorting
    if (sort === 'followers') {
      queryStr += ` ORDER BY cp.follower_count DESC`;
    } else if (sort === 'views') {
      queryStr += ` ORDER BY cp.view_count DESC`;
    } else if (sort === 'name') {
      queryStr += ` ORDER BY cp.display_name ASC`;
    } else {
      queryStr += ` ORDER BY cp.is_featured DESC, cp.follower_count DESC`;
    }

    const [rows] = await db.query(queryStr, params);

    // Fetch primary social links for preview cards
    const creatorIds = rows.map(r => r.id);
    let socialMap = {};
    if (creatorIds.length > 0) {
      const [links] = await db.query(`SELECT * FROM social_links WHERE creator_profile_id IN (${creatorIds.map(() => '?').join(',')})`, creatorIds);
      links.forEach(l => {
        if (!socialMap[l.creator_profile_id]) socialMap[l.creator_profile_id] = [];
        socialMap[l.creator_profile_id].push(l);
      });
    }

    const creators = rows.map(r => {
      let interests = [];
      try {
        interests = typeof r.gaming_interests === 'string' ? JSON.parse(r.gaming_interests) : r.gaming_interests;
      } catch (e) {
        interests = [];
      }
      return {
        ...r,
        gaming_interests: interests,
        social_links: socialMap[r.id] || []
      };
    });

    return res.json({ success: true, count: creators.length, creators });
  } catch (err) {
    console.error('[getCreators Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch creators.' });
  }
}

// GET SINGLE CREATOR BY USERNAME
async function getCreatorByUsername(req, res) {
  try {
    const { username } = req.params;

    const [userRows] = await db.query(
      `SELECT 
        cp.*,
        u.username,
        u.email,
        u.created_at as member_since
      FROM users u
      JOIN creator_profiles cp ON cp.user_id = u.id
      WHERE LOWER(u.username) = LOWER(?)`,
      [username]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Creator not found.' });
    }

    const creator = userRows[0];
    try {
      creator.gaming_interests = typeof creator.gaming_interests === 'string'
        ? JSON.parse(creator.gaming_interests)
        : creator.gaming_interests;
    } catch (e) {
      creator.gaming_interests = [];
    }

    // Increment view count
    await db.query('UPDATE creator_profiles SET view_count = view_count + 1 WHERE id = ?', [creator.id]);

    // Social links
    const [socialLinks] = await db.query(
      'SELECT * FROM social_links WHERE creator_profile_id = ? ORDER BY is_primary DESC, id ASC',
      [creator.id]
    );

    // Portfolio items
    const [portfolio] = await db.query(
      'SELECT * FROM portfolio_items WHERE creator_profile_id = ? ORDER BY created_at DESC',
      [creator.id]
    );

    // Digital products created by this user
    const [products] = await db.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.seller_id = ?
       ORDER BY p.is_featured DESC, p.created_at DESC`,
      [creator.user_id]
    );

    return res.json({
      success: true,
      creator: {
        ...creator,
        social_links: socialLinks,
        portfolio,
        products
      }
    });
  } catch (err) {
    console.error('[getCreatorByUsername Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch creator profile.' });
  }
}

// UPDATE CREATOR PROFILE (OWNER ONLY)
async function updateCreatorProfile(req, res) {
  try {
    const userId = req.user.id;
    const {
      display_name,
      tagline,
      bio,
      cover_url,
      avatar_url,
      banner_color,
      gaming_interests,
      featured_game,
      streaming_schedule
    } = req.body;

    const [existing] = await db.query('SELECT id FROM creator_profiles WHERE user_id = ?', [userId]);

    const interestsJson = Array.isArray(gaming_interests)
      ? JSON.stringify(gaming_interests)
      : (typeof gaming_interests === 'string' ? gaming_interests : JSON.stringify([]));

    if (existing.length === 0) {
      // Create profile
      await db.query(
        `INSERT INTO creator_profiles 
         (user_id, display_name, tagline, bio, cover_url, avatar_url, banner_color, gaming_interests, featured_game, streaming_schedule)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, display_name || req.user.full_name, tagline, bio, cover_url, avatar_url, banner_color, interestsJson, featured_game, streaming_schedule]
      );
    } else {
      // Update profile
      await db.query(
        `UPDATE creator_profiles SET
          display_name = COALESCE(?, display_name),
          tagline = COALESCE(?, tagline),
          bio = COALESCE(?, bio),
          cover_url = COALESCE(?, cover_url),
          avatar_url = COALESCE(?, avatar_url),
          banner_color = COALESCE(?, banner_color),
          gaming_interests = COALESCE(?, gaming_interests),
          featured_game = COALESCE(?, featured_game),
          streaming_schedule = COALESCE(?, streaming_schedule)
         WHERE user_id = ?`,
        [display_name, tagline, bio, cover_url, avatar_url, banner_color, interestsJson, featured_game, streaming_schedule, userId]
      );
    }

    // Also update users avatar_url if provided
    if (avatar_url) {
      await db.query('UPDATE users SET avatar_url = ? WHERE id = ?', [avatar_url, userId]);
    }

    const [updated] = await db.query('SELECT * FROM creator_profiles WHERE user_id = ?', [userId]);
    const profile = updated[0];
    try {
      profile.gaming_interests = JSON.parse(profile.gaming_interests);
    } catch (e) {}

    return res.json({ success: true, message: 'Creator profile updated!', creatorProfile: profile });
  } catch (err) {
    console.error('[updateCreatorProfile Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
}

// UPLOAD MEDIA (AVATAR / COVER / PORTFOLIO)
function uploadMedia(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const folder = req.file.fieldname === 'cover' ? 'covers' :
                   req.file.fieldname === 'portfolio' ? 'portfolios' :
                   (req.file.fieldname === 'product' || req.file.fieldname === 'preview') ? 'products' : 'avatars';

    const fileUrl = `/uploads/${folder}/${req.file.filename}`;

    return res.json({
      success: true,
      message: 'File uploaded successfully!',
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (err) {
    console.error('[uploadMedia Error]:', err);
    return res.status(500).json({ success: false, message: 'File upload failed.' });
  }
}

// ADD PORTFOLIO ITEM
async function addPortfolioItem(req, res) {
  try {
    const userId = req.user.id;
    const { title, description, image_url, category, tags } = req.body;

    if (!title || !image_url) {
      return res.status(400).json({ success: false, message: 'Title and image URL are required.' });
    }

    const [cp] = await db.query('SELECT id FROM creator_profiles WHERE user_id = ?', [userId]);
    if (cp.length === 0) {
      return res.status(404).json({ success: false, message: 'Creator profile not found.' });
    }

    const [insert] = await db.query(
      `INSERT INTO portfolio_items (creator_profile_id, title, description, image_url, category, tags)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [cp[0].id, title.trim(), description || '', image_url, category || 'Artwork', tags || '']
    );

    const [item] = await db.query('SELECT * FROM portfolio_items WHERE id = ?', [insert.insertId]);

    return res.status(201).json({ success: true, message: 'Portfolio item added!', item: item[0] });
  } catch (err) {
    console.error('[addPortfolioItem Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to add portfolio item.' });
  }
}

// DELETE PORTFOLIO ITEM
async function deletePortfolioItem(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [cp] = await db.query('SELECT id FROM creator_profiles WHERE user_id = ?', [userId]);
    if (cp.length === 0) {
      return res.status(404).json({ success: false, message: 'Creator profile not found.' });
    }

    await db.query(
      'DELETE FROM portfolio_items WHERE id = ? AND creator_profile_id = ?',
      [id, cp[0].id]
    );

    return res.json({ success: true, message: 'Portfolio item removed successfully.' });
  } catch (err) {
    console.error('[deletePortfolioItem Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete portfolio item.' });
  }
}

// UPDATE SOCIAL LINKS (REPLACE ALL FOR CURRENT CREATOR)
async function updateSocialLinks(req, res) {
  try {
    const userId = req.user.id;
    const { links } = req.body; // array of { platform, url, title, is_primary }

    const [cp] = await db.query('SELECT id FROM creator_profiles WHERE user_id = ?', [userId]);
    if (cp.length === 0) {
      return res.status(404).json({ success: false, message: 'Creator profile not found.' });
    }

    const creatorProfileId = cp[0].id;

    // Remove existing links
    await db.query('DELETE FROM social_links WHERE creator_profile_id = ?', [creatorProfileId]);

    if (Array.isArray(links)) {
      for (const link of links) {
        if (link.url && link.platform) {
          await db.query(
            'INSERT INTO social_links (creator_profile_id, platform, url, title, is_primary) VALUES (?, ?, ?, ?, ?)',
            [creatorProfileId, link.platform, link.url.trim(), link.title || link.platform, link.is_primary ? 1 : 0]
          );
        }
      }
    }

    const [updatedLinks] = await db.query('SELECT * FROM social_links WHERE creator_profile_id = ?', [creatorProfileId]);

    return res.json({ success: true, message: 'Social links updated!', social_links: updatedLinks });
  } catch (err) {
    console.error('[updateSocialLinks Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to update social links.' });
  }
}

module.exports = {
  getCreators,
  getCreatorByUsername,
  updateCreatorProfile,
  uploadMedia,
  addPortfolioItem,
  deletePortfolioItem,
  updateSocialLinks,
};
