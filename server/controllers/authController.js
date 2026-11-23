const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const db = require('../config/db');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
}

// REGISTER
async function register(req, res) {
  try {
    const { full_name, username, email, password, role } = req.body;

    if (!full_name || !username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const cleanEmail = email.trim().toLowerCase();

    // Check unique email or username
    const [existing] = await db.query(
      'SELECT id, username, email FROM users WHERE username = ? OR email = ?',
      [cleanUsername, cleanEmail]
    );

    if (existing.length > 0) {
      if (existing[0].username === cleanUsername) {
        return res.status(409).json({ success: false, message: 'Username is already taken.' });
      }
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const userRole = role === 'creator' ? 'creator' : 'user';
    const passwordHash = await bcrypt.hash(password, 10);
    const defaultAvatar = `https://images.unsplash.com/photo-${userRole === 'creator' ? '1534528741775-53994a69daeb' : '1535713875002-d1d0cf377fde'}?auto=format&fit=crop&w=400&q=80`;

    const [insertResult] = await db.query(
      'INSERT INTO users (full_name, username, email, password_hash, role, avatar_url) VALUES (?, ?, ?, ?, ?, ?)',
      [full_name.trim(), cleanUsername, cleanEmail, passwordHash, userRole, defaultAvatar]
    );

    const userId = insertResult.insertId;

    // If registered as creator, create creator_profiles entry
    if (userRole === 'creator') {
      await db.query(
        `INSERT INTO creator_profiles 
         (user_id, display_name, tagline, bio, cover_url, avatar_url, gaming_interests, featured_game, streaming_schedule)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          full_name.trim(),
          'Vice City Gaming Streamer & Digital Artist',
          'Welcome to my official ViceVerse hub! Check out my stream links and digital products.',
          'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1600&q=80',
          defaultAvatar,
          JSON.stringify(['GTA VI', 'Apex Legends']),
          'GTA VI',
          'Mon/Wed/Fri 8:00 PM EST'
        ]
      );
    }

    const user = {
      id: userId,
      full_name: full_name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      role: userRole,
      avatar_url: defaultAvatar,
      bio: ''
    };

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user
    });
  } catch (err) {
    console.error('[Auth Register Error]:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
}

// LOGIN
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    const [rows] = await db.query(
      'SELECT id, full_name, username, email, password_hash, role, avatar_url, bio FROM users WHERE email = ?',
      [cleanEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Clean user object
    delete user.password_hash;
    const token = generateToken(user);

    // If creator, fetch profile id
    let creatorProfile = null;
    if (user.role === 'creator' || user.role === 'admin') {
      const [cpRows] = await db.query('SELECT * FROM creator_profiles WHERE user_id = ?', [user.id]);
      if (cpRows.length > 0) {
        creatorProfile = cpRows[0];
        try {
          if (typeof creatorProfile.gaming_interests === 'string') {
            creatorProfile.gaming_interests = JSON.parse(creatorProfile.gaming_interests);
          }
        } catch (e) {
          creatorProfile.gaming_interests = [];
        }
      }
    }

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user,
      creatorProfile
    });
  } catch (err) {
    console.error('[Auth Login Error]:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
}

// GET CURRENT USER (ME)
async function getMe(req, res) {
  try {
    const [rows] = await db.query(
      'SELECT id, full_name, username, email, role, avatar_url, bio, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const user = rows[0];
    let creatorProfile = null;

    if (user.role === 'creator' || user.role === 'admin') {
      const [cpRows] = await db.query('SELECT * FROM creator_profiles WHERE user_id = ?', [user.id]);
      if (cpRows.length > 0) {
        creatorProfile = cpRows[0];
        try {
          if (typeof creatorProfile.gaming_interests === 'string') {
            creatorProfile.gaming_interests = JSON.parse(creatorProfile.gaming_interests);
          }
        } catch (e) {
          creatorProfile.gaming_interests = [];
        }
      }
    }

    return res.json({
      success: true,
      user,
      creatorProfile
    });
  } catch (err) {
    console.error('[Auth getMe Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve user profile.' });
  }
}

// UPDATE PROFILE
async function updateMe(req, res) {
  try {
    const { full_name, bio, avatar_url } = req.body;
    const userId = req.user.id;

    await db.query(
      'UPDATE users SET full_name = COALESCE(?, full_name), bio = COALESCE(?, bio), avatar_url = COALESCE(?, avatar_url) WHERE id = ?',
      [full_name, bio, avatar_url, userId]
    );

    const [updated] = await db.query(
      'SELECT id, full_name, username, email, role, avatar_url, bio FROM users WHERE id = ?',
      [userId]
    );

    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: updated[0]
    });
  } catch (err) {
    console.error('[Auth updateMe Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to update user profile.' });
  }
}

module.exports = {
  register,
  login,
  getMe,
  updateMe
};
