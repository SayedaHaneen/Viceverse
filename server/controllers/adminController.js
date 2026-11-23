const db = require('../config/db');

// ADMIN STATS OVERVIEW
async function getAdminStats(req, res) {
  try {
    const [userCount] = await db.query('SELECT COUNT(*) as count FROM users');
    const [creatorCount] = await db.query('SELECT COUNT(*) as count FROM creator_profiles');
    const [productCount] = await db.query('SELECT COUNT(*) as count FROM products');
    const [orderCount] = await db.query('SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as revenue FROM orders');
    const [recentOrders] = await db.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5');
    const [recentUsers] = await db.query('SELECT id, full_name, username, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5');

    return res.json({
      success: true,
      stats: {
        totalUsers: userCount[0].count,
        totalCreators: creatorCount[0].count,
        totalProducts: productCount[0].count,
        totalOrders: orderCount[0].count,
        totalRevenue: parseFloat(orderCount[0].revenue.toFixed(2)),
        recentOrders,
        recentUsers,
      }
    });
  } catch (err) {
    console.error('[getAdminStats Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve admin statistics.' });
  }
}

// GET ALL USERS (FOR ADMIN TABLE)
async function getAllUsers(req, res) {
  try {
    const { search, role } = req.query;
    let queryStr = `
      SELECT u.id, u.full_name, u.username, u.email, u.role, u.avatar_url, u.created_at,
             cp.display_name, cp.is_verified, cp.is_featured, cp.follower_count
      FROM users u
      LEFT JOIN creator_profiles cp ON cp.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (search && search.trim() !== '') {
      queryStr += ` AND (u.full_name LIKE ? OR u.username LIKE ? OR u.email LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    if (role && role !== 'all') {
      queryStr += ` AND u.role = ?`;
      params.push(role);
    }

    queryStr += ` ORDER BY u.created_at DESC`;

    const [users] = await db.query(queryStr, params);
    return res.json({ success: true, count: users.length, users });
  } catch (err) {
    console.error('[getAllUsers Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
}

// UPDATE USER ROLE OR VERIFICATION
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { role, is_verified, is_featured } = req.body;

    if (role) {
      await db.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    }

    if (is_verified !== undefined || is_featured !== undefined) {
      const [cp] = await db.query('SELECT id FROM creator_profiles WHERE user_id = ?', [id]);
      if (cp.length > 0) {
        await db.query(
          `UPDATE creator_profiles SET 
            is_verified = COALESCE(?, is_verified),
            is_featured = COALESCE(?, is_featured)
           WHERE user_id = ?`,
          [is_verified !== undefined ? (is_verified ? 1 : 0) : null, is_featured !== undefined ? (is_featured ? 1 : 0) : null, id]
        );
      }
    }

    return res.json({ success: true, message: 'User updated successfully.' });
  } catch (err) {
    console.error('[updateUser Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to update user.' });
  }
}

// DELETE USER
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    if (parseInt(id, 10) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own admin account.' });
    }

    await db.query('DELETE FROM users WHERE id = ?', [id]);
    return res.json({ success: true, message: 'User and all associated data deleted.' });
  } catch (err) {
    console.error('[deleteUser Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete user.' });
  }
}

// GET ALL ORDERS (FOR ADMIN)
async function getAllOrders(req, res) {
  try {
    const [orders] = await db.query(`
      SELECT o.*, COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);

    return res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    console.error('[getAllOrders Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
}

// UPDATE ORDER STATUS
async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status.' });
    }

    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    return res.json({ success: true, message: `Order status updated to ${status}.` });
  } catch (err) {
    console.error('[updateOrderStatus Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
}

// CREATE / EDIT / DELETE CATEGORIES (ADMIN)
async function createCategory(req, res) {
  try {
    const { name, slug, description, icon, banner_image, sort_order } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ success: false, message: 'Name and slug are required.' });
    }

    await db.query(
      `INSERT INTO categories (name, slug, description, icon, banner_image, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name.trim(), slug.trim().toLowerCase(), description || '', icon || 'Sparkles', banner_image || '', sort_order || 0]
    );

    return res.status(201).json({ success: true, message: 'Category created successfully!' });
  } catch (err) {
    console.error('[createCategory Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to create category.' });
  }
}

async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, slug, description, icon, banner_image, sort_order } = req.body;

    await db.query(
      `UPDATE categories SET
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        description = COALESCE(?, description),
        icon = COALESCE(?, icon),
        banner_image = COALESCE(?, banner_image),
        sort_order = COALESCE(?, sort_order)
       WHERE id = ?`,
      [name, slug, description, icon, banner_image, sort_order, id]
    );

    return res.json({ success: true, message: 'Category updated successfully!' });
  } catch (err) {
    console.error('[updateCategory Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to update category.' });
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    // Check if products exist in category
    const [prods] = await db.query('SELECT COUNT(*) as count FROM products WHERE category_id = ?', [id]);
    if (prods[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category: contains ${prods[0].count} products. Reassign or delete those products first.`
      });
    }

    await db.query('DELETE FROM categories WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (err) {
    console.error('[deleteCategory Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete category.' });
  }
}

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  createCategory,
  updateCategory,
  deleteCategory,
};
