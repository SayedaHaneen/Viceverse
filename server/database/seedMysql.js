const mysql = require('mysql2/promise');
const config = require('../config/config');
const seedData = require('./seedData');

async function seedMySQL() {
  console.log(`Connecting to MySQL at ${config.DB.HOST}:${config.DB.PORT}...`);
  let connection;
  try {
    connection = await mysql.createConnection({
      host: config.DB.HOST,
      port: config.DB.PORT,
      user: config.DB.USER,
      password: config.DB.PASSWORD,
      multipleStatements: true
    });

    console.log('Connected! Creating database viceverse if not exists...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS viceverse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE viceverse;`);

    console.log('Creating tables...');
    const schemaSql = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('user', 'creator', 'admin') DEFAULT 'user',
        avatar_url VARCHAR(255) DEFAULT '/uploads/avatars/default-avatar.png',
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS creator_profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        display_name VARCHAR(100) NOT NULL,
        tagline VARCHAR(255),
        bio TEXT,
        cover_url VARCHAR(255) DEFAULT '/uploads/covers/default-cover.jpg',
        avatar_url VARCHAR(255) DEFAULT '/uploads/avatars/default-avatar.png',
        banner_color VARCHAR(50) DEFAULT '#FF4FA3',
        gaming_interests TEXT,
        featured_game VARCHAR(100) DEFAULT 'GTA VI',
        streaming_schedule VARCHAR(255) DEFAULT 'Mon/Wed/Fri 8 PM EST',
        follower_count INT DEFAULT 0,
        view_count INT DEFAULT 0,
        is_verified BOOLEAN DEFAULT FALSE,
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS social_links (
        id INT AUTO_INCREMENT PRIMARY KEY,
        creator_profile_id INT NOT NULL,
        platform ENUM('twitch', 'youtube', 'kick', 'discord', 'x_twitter', 'instagram', 'tiktok', 'steam') NOT NULL,
        url VARCHAR(255) NOT NULL,
        title VARCHAR(100),
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (creator_profile_id) REFERENCES creator_profiles(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS portfolio_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        creator_profile_id INT NOT NULL,
        title VARCHAR(150) NOT NULL,
        description TEXT,
        image_url VARCHAR(255) NOT NULL,
        category VARCHAR(100) DEFAULT 'General Artwork',
        tags VARCHAR(255),
        view_count INT DEFAULT 0,
        likes_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (creator_profile_id) REFERENCES creator_profiles(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        icon VARCHAR(50) DEFAULT 'Sparkles',
        banner_image VARCHAR(255),
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        seller_id INT NOT NULL,
        category_id INT NOT NULL,
        title VARCHAR(200) NOT NULL,
        slug VARCHAR(200) NOT NULL UNIQUE,
        description TEXT,
        price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        original_price DECIMAL(10,2) DEFAULT NULL,
        preview_image VARCHAR(255) NOT NULL,
        thumbnail_images TEXT,
        file_type VARCHAR(50) DEFAULT 'ZIP / PSD / PNG',
        file_size_mb DECIMAL(6,2) DEFAULT 25.50,
        download_url VARCHAR(255) DEFAULT '/downloads/viceverse-pack.zip',
        tags VARCHAR(255),
        is_featured BOOLEAN DEFAULT FALSE,
        is_trending BOOLEAN DEFAULT FALSE,
        sales_count INT DEFAULT 0,
        rating DECIMAL(3,2) DEFAULT 5.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS cart_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (user_id, product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(64) NOT NULL UNIQUE,
        user_id INT NULL,
        customer_name VARCHAR(100) NOT NULL,
        customer_email VARCHAR(100) NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        discount_amount DECIMAL(10,2) DEFAULT 0.00,
        status ENUM('pending', 'completed', 'cancelled') DEFAULT 'completed',
        payment_method VARCHAR(50) DEFAULT 'demo_vice_credits',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        title VARCHAR(200) NOT NULL,
        preview_image VARCHAR(255),
        download_key VARCHAR(128) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS saved_products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_saved_product (user_id, product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    await connection.query(schemaSql);
    console.log('Tables verified! Checking seed data...');

    const [userRows] = await connection.query('SELECT COUNT(*) as count FROM users');
    if (userRows[0].count === 0) {
      console.log('Inserting seed categories...');
      for (const cat of seedData.categories) {
        await connection.query(
          'INSERT INTO categories (name, slug, description, icon, banner_image, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
          [cat.name, cat.slug, cat.description, cat.icon, cat.banner_image, cat.sort_order]
        );
      }

      console.log('Inserting seed users...');
      for (const u of seedData.users) {
        await connection.query(
          'INSERT INTO users (id, full_name, username, email, password_hash, role, avatar_url, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [u.id, u.full_name, u.username, u.email, u.password_hash, u.role, u.avatar_url, u.bio]
        );
      }

      console.log('Inserting seed creator profiles...');
      for (const cp of seedData.creator_profiles) {
        await connection.query(
          `INSERT INTO creator_profiles (user_id, display_name, tagline, bio, cover_url, avatar_url, banner_color, gaming_interests, featured_game, streaming_schedule, follower_count, view_count, is_verified, is_featured)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [cp.user_id, cp.display_name, cp.tagline, cp.bio, cp.cover_url, cp.avatar_url, cp.banner_color, cp.gaming_interests, cp.featured_game, cp.streaming_schedule, cp.follower_count, cp.view_count, cp.is_verified ? 1 : 0, cp.is_featured ? 1 : 0]
        );
      }

      console.log('Inserting seed social links...');
      for (const s of seedData.social_links) {
        await connection.query(
          'INSERT INTO social_links (creator_profile_id, platform, url, title, is_primary) VALUES (?, ?, ?, ?, ?)',
          [s.creator_profile_id, s.platform, s.url, s.title, s.is_primary ? 1 : 0]
        );
      }

      console.log('Inserting seed portfolio items...');
      for (const p of seedData.portfolio_items) {
        await connection.query(
          'INSERT INTO portfolio_items (creator_profile_id, title, description, image_url, category, tags, view_count, likes_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [p.creator_profile_id, p.title, p.description, p.image_url, p.category, p.tags, p.view_count, p.likes_count]
        );
      }

      console.log('Inserting seed products...');
      for (const pr of seedData.products) {
        await connection.query(
          `INSERT INTO products (seller_id, category_id, title, slug, description, price, original_price, preview_image, thumbnail_images, file_type, file_size_mb, download_url, tags, is_featured, is_trending, sales_count, rating)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [pr.seller_id, pr.category_id, pr.title, pr.slug, pr.description, pr.price, pr.original_price, pr.preview_image, pr.thumbnail_images, pr.file_type, pr.file_size_mb, pr.download_url, pr.tags, pr.is_featured ? 1 : 0, pr.is_trending ? 1 : 0, pr.sales_count, pr.rating]
        );
      }
      console.log('MySQL Database populated with complete ViceVerse dataset!');
    } else {
      console.log('Data already present in MySQL database.');
    }

    console.log('MySQL setup completed successfully.');
  } catch (err) {
    console.error('MySQL seeding error:', err.message);
  } finally {
    if (connection) await connection.end();
  }
}

if (require.main === module) {
  seedMySQL();
}

module.exports = seedMySQL;
