const db = require('../config/db');

// CREATE DEMO ORDER (SIMULATED CHECKOUT)
async function createDemoOrder(req, res) {
  try {
    const userId = req.user ? req.user.id : null;
    const {
      customer_name,
      customer_email,
      payment_method = 'demo_vice_credits',
      promo_code = '',
      items = [], // fallback if guest or passed directly
    } = req.body;

    if (!customer_name || !customer_email) {
      return res.status(400).json({ success: false, message: 'Customer name and email are required for demo checkout.' });
    }

    let checkoutItems = [];

    // If user is logged in, attempt to fetch from user's active cart first
    if (userId) {
      const [cartRows] = await db.query(
        `SELECT ci.quantity, p.id as product_id, p.title, p.price, p.preview_image
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.user_id = ?`,
        [userId]
      );
      if (cartRows.length > 0) {
        checkoutItems = cartRows;
      }
    }

    // If no items in DB cart, use items from request body
    if (checkoutItems.length === 0 && Array.isArray(items) && items.length > 0) {
      const productIds = items.map(i => i.product_id || i.id);
      const [prodRows] = await db.query(
        `SELECT id as product_id, title, price, preview_image FROM products WHERE id IN (${productIds.map(() => '?').join(',')})`,
        productIds
      );
      checkoutItems = prodRows.map(p => {
        const matching = items.find(i => (i.product_id || i.id) === p.product_id);
        return {
          ...p,
          quantity: matching ? (matching.quantity || 1) : 1
        };
      });
    }

    if (checkoutItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Your checkout cart is empty.' });
    }

    // Calculate totals
    const rawTotal = checkoutItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    let discount = 0;
    if (promo_code && promo_code.toUpperCase() === 'VICE20') {
      discount = rawTotal * 0.20;
    }

    const finalTotal = Math.max(0, rawTotal - discount);
    const orderNumber = `VV-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Insert order record
    const [orderInsert] = await db.query(
      `INSERT INTO orders 
       (order_number, user_id, customer_name, customer_email, total_amount, discount_amount, status, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, 'completed', ?)`,
      [orderNumber, userId, customer_name.trim(), customer_email.trim(), parseFloat(finalTotal.toFixed(2)), parseFloat(discount.toFixed(2)), payment_method]
    );

    const orderId = orderInsert.insertId;

    // Insert order items & increment product sales count
    const confirmedItems = [];
    for (const item of checkoutItems) {
      const downloadKey = `KEY-VV-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      await db.query(
        `INSERT INTO order_items (order_id, product_id, price, title, preview_image, download_key)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, parseFloat(item.price), item.title, item.preview_image, downloadKey]
      );

      await db.query(
        'UPDATE products SET sales_count = sales_count + ? WHERE id = ?',
        [item.quantity, item.product_id]
      );

      confirmedItems.push({
        ...item,
        downloadKey,
        downloadUrl: `/api/orders/download/${downloadKey}`
      });
    }

    // Clear cart if logged in
    if (userId) {
      await db.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    }

    return res.status(201).json({
      success: true,
      message: 'Demo order successfully processed and recorded!',
      order: {
        id: orderId,
        orderNumber,
        customerName: customer_name,
        customerEmail: customer_email,
        subtotal: parseFloat(rawTotal.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
        total: parseFloat(finalTotal.toFixed(2)),
        status: 'completed',
        paymentMethod: payment_method,
        createdAt: new Date().toISOString(),
        items: confirmedItems,
      }
    });
  } catch (err) {
    console.error('[createDemoOrder Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to process demo order.' });
  }
}

// GET USER ORDERS
async function getUserOrders(req, res) {
  try {
    const userId = req.user.id;

    const [orders] = await db.query(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    const orderIds = orders.map(o => o.id);
    let itemsMap = {};
    if (orderIds.length > 0) {
      const [items] = await db.query(
        `SELECT * FROM order_items WHERE order_id IN (${orderIds.map(() => '?').join(',')})`,
        orderIds
      );
      items.forEach(i => {
        if (!itemsMap[i.order_id]) itemsMap[i.order_id] = [];
        itemsMap[i.order_id].push(i);
      });
    }

    const fullOrders = orders.map(o => ({
      ...o,
      items: itemsMap[o.id] || []
    }));

    return res.json({ success: true, orders: fullOrders });
  } catch (err) {
    console.error('[getUserOrders Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
}

// GET ORDER DETAILS BY ID OR ORDER NUMBER
async function getOrderById(req, res) {
  try {
    const { identifier } = req.params;

    const [orders] = await db.query(
      `SELECT * FROM orders WHERE id = ? OR order_number = ?`,
      [isNaN(identifier) ? 0 : parseInt(identifier, 10), identifier]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const order = orders[0];
    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);

    return res.json({
      success: true,
      order: {
        ...order,
        items
      }
    });
  } catch (err) {
    console.error('[getOrderById Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to load order.' });
  }
}

// DEMO DIGITAL ASSET DOWNLOAD HANDLER
async function downloadAsset(req, res) {
  try {
    const { downloadKey } = req.params;

    // Look up item in database if available
    const [rows] = await db.query(
      `SELECT oi.*, o.order_number, o.customer_name, o.customer_email
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE oi.download_key = ?`,
      [downloadKey]
    );

    const item = rows.length > 0 ? rows[0] : null;

    res.setHeader('Content-Disposition', `attachment; filename="VICEVERSE-${downloadKey}.txt"`);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(`======================================================================
 VICEVERSE DIGITAL ASSET AUTHENTICATION CERTIFICATE
======================================================================

License Status : ACTIVE & VERIFIED
Download Key   : ${downloadKey}
Order Reference: ${item ? item.order_number : 'DEMO-VERIFIED'}
Issued To      : ${item ? item.customer_name : 'Gamer / Streamer'} (${item ? item.customer_email : 'Verified Account'})
Product Title  : ${item ? item.title : 'Vice City Digital Asset Pack'}
Issue Date     : ${new Date().toUTCString()}

----------------------------------------------------------------------
COMMERCIAL STREAMING & BROADCAST LICENSE
----------------------------------------------------------------------
This file serves as proof of license for the digital assets included
in this package. You are authorized to use this asset on Twitch, YouTube,
Kick, Discord, and streaming overlays without copyright claims.

Thank you for supporting gaming creators on VICEVERSE!
Enjoy the neon atmosphere of Vice City & Leonida.
======================================================================
`);
  } catch (err) {
    console.error('Download asset error:', err);
    res.status(500).send('Error generating download package.');
  }
}

module.exports = {
  createDemoOrder,
  getUserOrders,
  getOrderById,
  downloadAsset,
};
