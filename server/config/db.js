const mysql = require('mysql2/promise');
const config = require('./config');
const path = require('path');
const fs = require('fs');

let pool = null;
let sqliteDb = null;
let isUsingSqlite = false;

// Create data directory for local persistence if needed
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper to convert standard MySQL parameterized queries (? placeholders)
// to SQLite compatible execution if in SQLite mode
function convertMySqlToSqlite(sql) {
  let converted = sql
    .replace(/INT AUTO_INCREMENT PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
    .replace(/BOOLEAN DEFAULT FALSE/gi, 'INTEGER DEFAULT 0')
    .replace(/BOOLEAN DEFAULT TRUE/gi, 'INTEGER DEFAULT 1')
    .replace(/BOOLEAN/gi, 'INTEGER')
    .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP/gi, 'DATETIME DEFAULT CURRENT_TIMESTAMP')
    .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/gi, 'DATETIME DEFAULT CURRENT_TIMESTAMP')
    .replace(/TIMESTAMP/gi, 'DATETIME')
    .replace(/DECIMAL\(\d+,\s*\d+\)/gi, 'NUMERIC')
    .replace(/ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;/gi, ';')
    .replace(/ENGINE=InnoDB;/gi, ';')
    .replace(/CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci/gi, '')
    .replace(/CREATE DATABASE IF NOT EXISTS.*;/gi, '')
    .replace(/USE viceverse;/gi, '');

  return converted;
}

// Initialize SQLite fallback engine using built-in node:sqlite
function initSqliteEngine() {
  const { DatabaseSync } = require('node:sqlite');
  const dbFile = path.join(dataDir, 'viceverse.sqlite');
  sqliteDb = new DatabaseSync(dbFile);
  sqliteDb.exec('PRAGMA foreign_keys = ON;');
  isUsingSqlite = true;
  console.log(`[DB] Operating in Embedded Relational Mode (SQLite: ${dbFile})`);
}

// Run query abstraction
async function query(sql, params = []) {
  if (!isUsingSqlite && pool) {
    try {
      return await pool.query(sql, params);
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.code === 'EACCES' || err.code === 'ENOTFOUND') {
        console.warn(`[DB] MySQL connection lost (${err.code}). Switching to Embedded Relational Store.`);
        initSqliteEngine();
        return query(sql, params);
      }
      throw err;
    }
  }

  // SQLite execution
  if (!sqliteDb) {
    initSqliteEngine();
  }

  // Normalize parameters: convert undefined to null
  const normalizedParams = params.map(p => (p === undefined ? null : p));

  // Normalize SQL and params for SQLite
  const trimmed = sql.trim();
  const isSelect = /^(SELECT|PRAGMA|EXPLAIN|SHOW)/i.test(trimmed);

  try {
    if (isSelect) {
      const stmt = sqliteDb.prepare(trimmed);
      const rows = stmt.all(...normalizedParams);
      return [rows, []];
    } else {
      const stmt = sqliteDb.prepare(trimmed);
      const info = stmt.run(...normalizedParams);
      return [{ insertId: Number(info.lastInsertRowid), affectedRows: info.changes }, []];
    }
  } catch (sqlErr) {
    console.error(`[DB Error] Query failed: ${trimmed.slice(0, 100)}...`, sqlErr.message);
    throw sqlErr;
  }
}

// Initialize DB connection and schema
async function initDatabase() {
  // First attempt MySQL
  try {
    const testPool = mysql.createPool({
      host: config.DB.HOST,
      port: config.DB.PORT,
      user: config.DB.USER,
      password: config.DB.PASSWORD,
      database: config.DB.DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 2000,
    });

    const [test] = await testPool.query('SELECT 1 as connected');
    if (test && test[0].connected === 1) {
      pool = testPool;
      isUsingSqlite = false;
      console.log(`[DB] Successfully connected to MySQL at ${config.DB.HOST}:${config.DB.PORT}/${config.DB.DATABASE}`);
      return;
    }
  } catch (err) {
    console.log(`[DB] MySQL not reachable at ${config.DB.HOST}:${config.DB.PORT} (${err.code || err.message}).`);
    console.log(`[DB] Activating built-in high-performance Relational SQLite Database.`);
    initSqliteEngine();
  }

  // Ensure tables and seed data exist
  await setupTablesAndSeed();
}

// Setup schema and seed data
async function setupTablesAndSeed() {
  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  const seedData = require('../database/seedData');

  if (isUsingSqlite) {
    // Create SQLite tables
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        avatar_url TEXT DEFAULT '/uploads/avatars/default-avatar.png',
        bio TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS creator_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL UNIQUE,
        display_name TEXT NOT NULL,
        tagline TEXT,
        bio TEXT,
        cover_url TEXT DEFAULT '/uploads/covers/default-cover.jpg',
        avatar_url TEXT DEFAULT '/uploads/avatars/default-avatar.png',
        banner_color TEXT DEFAULT '#FF4FA3',
        gaming_interests TEXT,
        featured_game TEXT DEFAULT 'GTA VI',
        streaming_schedule TEXT DEFAULT 'Mon/Wed/Fri 8 PM EST',
        follower_count INTEGER DEFAULT 0,
        view_count INTEGER DEFAULT 0,
        is_verified INTEGER DEFAULT 0,
        is_featured INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS social_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        creator_profile_id INTEGER NOT NULL,
        platform TEXT NOT NULL,
        url TEXT NOT NULL,
        title TEXT,
        is_primary INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (creator_profile_id) REFERENCES creator_profiles(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS portfolio_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        creator_profile_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT NOT NULL,
        category TEXT DEFAULT 'General Artwork',
        tags TEXT,
        view_count INTEGER DEFAULT 0,
        likes_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (creator_profile_id) REFERENCES creator_profiles(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        icon TEXT DEFAULT 'Sparkles',
        banner_image TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        seller_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        price NUMERIC NOT NULL DEFAULT 0.00,
        original_price NUMERIC,
        preview_image TEXT NOT NULL,
        thumbnail_images TEXT,
        file_type TEXT DEFAULT 'ZIP / PSD / PNG',
        file_size_mb NUMERIC DEFAULT 25.50,
        download_url TEXT DEFAULT '/downloads/viceverse-pack.zip',
        tags TEXT,
        is_featured INTEGER DEFAULT 0,
        is_trending INTEGER DEFAULT 0,
        sales_count INTEGER DEFAULT 0,
        rating NUMERIC DEFAULT 5.00,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
      );

      CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE(user_id, product_id)
      );

      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT NOT NULL UNIQUE,
        user_id INTEGER NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        total_amount NUMERIC NOT NULL,
        discount_amount NUMERIC DEFAULT 0.00,
        status TEXT DEFAULT 'completed',
        payment_method TEXT DEFAULT 'demo_vice_credits',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        price NUMERIC NOT NULL,
        title TEXT NOT NULL,
        preview_image TEXT,
        download_key TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
      );

      CREATE TABLE IF NOT EXISTS saved_products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE(user_id, product_id)
      );
    `);

    // Check if seed data exists
    const [existingUsers] = await query('SELECT COUNT(*) as count FROM users');
    if (existingUsers[0].count === 0) {
      console.log('[DB] Seeding initial database with sample creators, products & categories...');
      
      // Insert categories
      for (const cat of seedData.categories) {
        await query(
          'INSERT INTO categories (name, slug, description, icon, banner_image, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
          [cat.name, cat.slug, cat.description, cat.icon, cat.banner_image, cat.sort_order]
        );
      }

      // Insert users
      for (const u of seedData.users) {
        await query(
          'INSERT INTO users (id, full_name, username, email, password_hash, role, avatar_url, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [u.id, u.full_name, u.username, u.email, u.password_hash, u.role, u.avatar_url, u.bio]
        );
      }

      // Insert creator profiles
      for (const cp of seedData.creator_profiles) {
        await query(
          `INSERT INTO creator_profiles (user_id, display_name, tagline, bio, cover_url, avatar_url, banner_color, gaming_interests, featured_game, streaming_schedule, follower_count, view_count, is_verified, is_featured)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [cp.user_id, cp.display_name, cp.tagline, cp.bio, cp.cover_url, cp.avatar_url, cp.banner_color, cp.gaming_interests, cp.featured_game, cp.streaming_schedule, cp.follower_count, cp.view_count, cp.is_verified ? 1 : 0, cp.is_featured ? 1 : 0]
        );
      }

      // Insert social links
      for (const s of seedData.social_links) {
        await query(
          'INSERT INTO social_links (creator_profile_id, platform, url, title, is_primary) VALUES (?, ?, ?, ?, ?)',
          [s.creator_profile_id, s.platform, s.url, s.title, s.is_primary ? 1 : 0]
        );
      }

      // Insert portfolio items
      for (const p of seedData.portfolio_items) {
        await query(
          'INSERT INTO portfolio_items (creator_profile_id, title, description, image_url, category, tags, view_count, likes_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [p.creator_profile_id, p.title, p.description, p.image_url, p.category, p.tags, p.view_count, p.likes_count]
        );
      }

      // Insert products
      for (const pr of seedData.products) {
        await query(
          `INSERT INTO products (seller_id, category_id, title, slug, description, price, original_price, preview_image, thumbnail_images, file_type, file_size_mb, download_url, tags, is_featured, is_trending, sales_count, rating)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [pr.seller_id, pr.category_id, pr.title, pr.slug, pr.description, pr.price, pr.original_price, pr.preview_image, pr.thumbnail_images, pr.file_type, pr.file_size_mb, pr.download_url, pr.tags, pr.is_featured ? 1 : 0, pr.is_trending ? 1 : 0, pr.sales_count, pr.rating]
        );
      }

      // Insert initial demo order for admin overview
      const [orderResult] = await query(
        `INSERT INTO orders (order_number, user_id, customer_name, customer_email, total_amount, discount_amount, status, payment_method)
         VALUES ('VV-DEMO-89214', 10, 'Alex Mercer', 'player1@viceverse.gg', 49.98, 10.00, 'completed', 'demo_vice_credits')`
      );

      await query(
        `INSERT INTO order_items (order_id, product_id, price, title, preview_image, download_key)
         VALUES (?, 1, 14.99, 'Vice Lights 8K OLED Wallpaper Pack', 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80', 'KEY-VV-OLED-88219')`,
        [orderResult.insertId]
      );
      await query(
        `INSERT INTO order_items (order_id, product_id, price, title, preview_image, download_key)
         VALUES (?, 2, 34.99, 'Vice Neon Complete Animated Stream Pack', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80', 'KEY-VV-STREAM-44102')`,
        [orderResult.insertId]
      );

      console.log('[DB] Database seeded successfully with 8 creators, 12+ products, orders, and portfolios!');
    }
  }
}

module.exports = {
  query,
  initDatabase,
  getPool: () => pool,
  isSqlite: () => isUsingSqlite,
};
