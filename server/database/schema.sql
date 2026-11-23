-- =======================================================
-- VICEVERSE DATABASE SCHEMA
-- Gaming Creator Hub & Digital Marketplace
-- MySQL / MariaDB 10.4+ Compatible
-- =======================================================

CREATE DATABASE IF NOT EXISTS viceverse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE viceverse;

-- 1. USERS TABLE
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_username (username),
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. CREATOR PROFILES TABLE
CREATE TABLE IF NOT EXISTS creator_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  tagline VARCHAR(255),
  bio TEXT,
  cover_url VARCHAR(255) DEFAULT '/uploads/covers/default-cover.jpg',
  avatar_url VARCHAR(255) DEFAULT '/uploads/avatars/default-avatar.png',
  banner_color VARCHAR(50) DEFAULT '#FF4FA3',
  gaming_interests TEXT, -- JSON array of tags, e.g. ["GTA VI", "Cyberpunk", "Apex"]
  featured_game VARCHAR(100) DEFAULT 'GTA VI',
  streaming_schedule VARCHAR(255) DEFAULT 'Mon/Wed/Fri 8 PM EST',
  follower_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_creator_featured (is_featured),
  INDEX idx_creator_verified (is_verified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. SOCIAL LINKS TABLE
CREATE TABLE IF NOT EXISTS social_links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  creator_profile_id INT NOT NULL,
  platform ENUM('twitch', 'youtube', 'kick', 'discord', 'x_twitter', 'instagram', 'tiktok', 'steam') NOT NULL,
  url VARCHAR(255) NOT NULL,
  title VARCHAR(100),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_profile_id) REFERENCES creator_profiles(id) ON DELETE CASCADE,
  INDEX idx_social_creator (creator_profile_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. PORTFOLIO ITEMS TABLE
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
  FOREIGN KEY (creator_profile_id) REFERENCES creator_profiles(id) ON DELETE CASCADE,
  INDEX idx_portfolio_creator (creator_profile_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50) DEFAULT 'Sparkles',
  banner_image VARCHAR(255),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. PRODUCTS TABLE
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
  thumbnail_images TEXT, -- JSON array of image URLs
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
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  INDEX idx_products_category (category_id),
  INDEX idx_products_seller (seller_id),
  INDEX idx_products_featured (is_featured),
  INDEX idx_products_trending (is_trending),
  INDEX idx_products_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. ORDERS TABLE
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
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_orders_number (order_number),
  INDEX idx_orders_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. ORDER ITEMS TABLE
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
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  INDEX idx_order_items_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. SAVED PRODUCTS (WISHLIST) TABLE
CREATE TABLE IF NOT EXISTS saved_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_saved_product (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
