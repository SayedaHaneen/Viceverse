const db = require('../config/db');

// GET ALL PRODUCTS (MARKETPLACE)
async function getProducts(req, res) {
  try {
    const { search, category, sort, featured, trending, minPrice, maxPrice } = req.query;

    let queryStr = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        u.username as seller_username,
        u.full_name as seller_name,
        u.avatar_url as seller_avatar
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
      WHERE 1=1
    `;

    const params = [];

    if (search && search.trim() !== '') {
      queryStr += ` AND (p.title LIKE ? OR p.description LIKE ? OR p.tags LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    if (category && category !== 'all') {
      queryStr += ` AND (c.slug = ? OR c.id = ?)`;
      params.push(category, category);
    }

    if (featured === 'true' || featured === '1') {
      queryStr += ` AND p.is_featured = 1`;
    }

    if (trending === 'true' || trending === '1') {
      queryStr += ` AND p.is_trending = 1`;
    }

    if (minPrice && !isNaN(parseFloat(minPrice))) {
      queryStr += ` AND p.price >= ?`;
      params.push(parseFloat(minPrice));
    }

    if (maxPrice && !isNaN(parseFloat(maxPrice))) {
      queryStr += ` AND p.price <= ?`;
      params.push(parseFloat(maxPrice));
    }

    // Sorting
    if (sort === 'price-low') {
      queryStr += ` ORDER BY p.price ASC`;
    } else if (sort === 'price-high') {
      queryStr += ` ORDER BY p.price DESC`;
    } else if (sort === 'rating') {
      queryStr += ` ORDER BY p.rating DESC`;
    } else if (sort === 'sales') {
      queryStr += ` ORDER BY p.sales_count DESC`;
    } else if (sort === 'trending') {
      queryStr += ` ORDER BY p.is_trending DESC, p.sales_count DESC`;
    } else {
      queryStr += ` ORDER BY p.is_featured DESC, p.created_at DESC`;
    }

    const [rows] = await db.query(queryStr, params);

    const products = rows.map(p => {
      let thumbs = [];
      try {
        thumbs = typeof p.thumbnail_images === 'string' ? JSON.parse(p.thumbnail_images) : p.thumbnail_images;
      } catch (e) {
        thumbs = [p.preview_image];
      }
      return {
        ...p,
        thumbnail_images: thumbs
      };
    });

    return res.json({ success: true, count: products.length, products });
  } catch (err) {
    console.error('[getProducts Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve products.' });
  }
}

// GET PRODUCT DETAILS BY SLUG OR ID
async function getProductBySlug(req, res) {
  try {
    const { slug } = req.params;

    const [rows] = await db.query(
      `SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        u.username as seller_username,
        u.full_name as seller_name,
        u.avatar_url as seller_avatar,
        cp.display_name as seller_display_name,
        cp.is_verified as seller_verified
       FROM products p
       JOIN categories c ON p.category_id = c.id
       JOIN users u ON p.seller_id = u.id
       LEFT JOIN creator_profiles cp ON cp.user_id = u.id
       WHERE p.slug = ? OR p.id = ?`,
      [slug, isNaN(slug) ? 0 : parseInt(slug, 10)]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const product = rows[0];
    try {
      product.thumbnail_images = typeof product.thumbnail_images === 'string'
        ? JSON.parse(product.thumbnail_images)
        : product.thumbnail_images;
    } catch (e) {
      product.thumbnail_images = [product.preview_image];
    }

    // Related products in the same category
    const [relatedRows] = await db.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug, u.username as seller_username
       FROM products p
       JOIN categories c ON p.category_id = c.id
       JOIN users u ON p.seller_id = u.id
       WHERE p.category_id = ? AND p.id != ?
       LIMIT 4`,
      [product.category_id, product.id]
    );

    return res.json({
      success: true,
      product,
      relatedProducts: relatedRows
    });
  } catch (err) {
    console.error('[getProductBySlug Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to load product.' });
  }
}

// GET ALL CATEGORIES
async function getCategories(req, res) {
  try {
    const [categories] = await db.query(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id
      ORDER BY c.sort_order ASC
    `);

    return res.json({ success: true, categories });
  } catch (err) {
    console.error('[getCategories Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
}

// CREATE NEW PRODUCT
async function createProduct(req, res) {
  try {
    const userId = req.user.id;
    const {
      title,
      category_id,
      description,
      price,
      original_price,
      preview_image,
      thumbnail_images,
      file_type,
      file_size_mb,
      tags,
      is_featured,
      is_trending
    } = req.body;

    if (!title || !category_id || !price || !preview_image) {
      return res.status(400).json({ success: false, message: 'Title, category, price, and preview image are required.' });
    }

    const slug = title.toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 10000);

    const thumbsJson = Array.isArray(thumbnail_images)
      ? JSON.stringify(thumbnail_images)
      : JSON.stringify([preview_image]);

    const [insert] = await db.query(
      `INSERT INTO products 
       (seller_id, category_id, title, slug, description, price, original_price, preview_image, thumbnail_images, file_type, file_size_mb, tags, is_featured, is_trending)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        category_id,
        title.trim(),
        slug,
        description || '',
        parseFloat(price),
        original_price ? parseFloat(original_price) : null,
        preview_image,
        thumbsJson,
        file_type || 'Digital ZIP Pack',
        file_size_mb ? parseFloat(file_size_mb) : 25.0,
        tags || '',
        is_featured ? 1 : 0,
        is_trending ? 1 : 0
      ]
    );

    const [created] = await db.query('SELECT * FROM products WHERE id = ?', [insert.insertId]);

    return res.status(201).json({ success: true, message: 'Product created successfully!', product: created[0] });
  } catch (err) {
    console.error('[createProduct Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to create product.' });
  }
}

// UPDATE PRODUCT
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (!isAdmin && existing[0].seller_id !== userId) {
      return res.status(403).json({ success: false, message: 'Permission denied. Not product owner.' });
    }

    const {
      title,
      category_id,
      description,
      price,
      original_price,
      preview_image,
      thumbnail_images,
      file_type,
      file_size_mb,
      tags,
      is_featured,
      is_trending
    } = req.body;

    const thumbsJson = thumbnail_images ? (Array.isArray(thumbnail_images) ? JSON.stringify(thumbnail_images) : thumbnail_images) : existing[0].thumbnail_images;

    await db.query(
      `UPDATE products SET
        title = COALESCE(?, title),
        category_id = COALESCE(?, category_id),
        description = COALESCE(?, description),
        price = COALESCE(?, price),
        original_price = COALESCE(?, original_price),
        preview_image = COALESCE(?, preview_image),
        thumbnail_images = COALESCE(?, thumbnail_images),
        file_type = COALESCE(?, file_type),
        file_size_mb = COALESCE(?, file_size_mb),
        tags = COALESCE(?, tags),
        is_featured = COALESCE(?, is_featured),
        is_trending = COALESCE(?, is_trending)
       WHERE id = ?`,
      [
        title,
        category_id,
        description,
        price,
        original_price,
        preview_image,
        thumbsJson,
        file_type,
        file_size_mb,
        tags,
        is_featured !== undefined ? (is_featured ? 1 : 0) : existing[0].is_featured,
        is_trending !== undefined ? (is_trending ? 1 : 0) : existing[0].is_trending,
        id
      ]
    );

    const [updated] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Product updated successfully!', product: updated[0] });
  } catch (err) {
    console.error('[updateProduct Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
}

// DELETE PRODUCT
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (!isAdmin && existing[0].seller_id !== userId) {
      return res.status(403).json({ success: false, message: 'Permission denied. Not product owner.' });
    }

    await db.query('DELETE FROM products WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (err) {
    console.error('[deleteProduct Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
}

// GET SAVED / WISHLIST PRODUCTS
async function getSavedProducts(req, res) {
  try {
    const userId = req.user.id;
    const [saved] = await db.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug, u.username as seller_username
       FROM saved_products sp
       JOIN products p ON sp.product_id = p.id
       JOIN categories c ON p.category_id = c.id
       JOIN users u ON p.seller_id = u.id
       WHERE sp.user_id = ?
       ORDER BY sp.created_at DESC`,
      [userId]
    );

    return res.json({ success: true, savedProducts: saved });
  } catch (err) {
    console.error('[getSavedProducts Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch saved products.' });
  }
}

// TOGGLE SAVE / WISHLIST PRODUCT
async function toggleSaveProduct(req, res) {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required.' });
    }

    const [existing] = await db.query(
      'SELECT id FROM saved_products WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existing.length > 0) {
      await db.query('DELETE FROM saved_products WHERE user_id = ? AND product_id = ?', [userId, productId]);
      return res.json({ success: true, isSaved: false, message: 'Removed from saved wishlist.' });
    } else {
      await db.query('INSERT INTO saved_products (user_id, product_id) VALUES (?, ?)', [userId, productId]);
      return res.json({ success: true, isSaved: true, message: 'Saved to wishlist!' });
    }
  } catch (err) {
    console.error('[toggleSaveProduct Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to toggle saved product.' });
  }
}

module.exports = {
  getProducts,
  getProductBySlug,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  getSavedProducts,
  toggleSaveProduct,
};
