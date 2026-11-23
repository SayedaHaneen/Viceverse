const db = require('../config/db');

// GET USER CART
async function getCart(req, res) {
  try {
    const userId = req.user.id;

    const [items] = await db.query(
      `SELECT 
        ci.id as cart_item_id,
        ci.quantity,
        ci.created_at,
        p.id as product_id,
        p.title,
        p.slug,
        p.price,
        p.original_price,
        p.preview_image,
        p.file_type,
        c.name as category_name,
        u.username as seller_username
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       JOIN categories c ON p.category_id = c.id
       JOIN users u ON p.seller_id = u.id
       WHERE ci.user_id = ?
       ORDER BY ci.created_at DESC`,
      [userId]
    );

    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    const total = subtotal;

    return res.json({
      success: true,
      cart: {
        items,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: parseFloat(subtotal.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
      }
    });
  } catch (err) {
    console.error('[getCart Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve cart.' });
  }
}

// ADD TO CART
async function addToCart(req, res) {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required.' });
    }

    const [product] = await db.query('SELECT id, title, price FROM products WHERE id = ?', [productId]);
    if (product.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const [existing] = await db.query(
      'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existing.length > 0) {
      // Digital products typically have quantity 1, but we allow incrementing or keeping 1
      await db.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
        [parseInt(quantity, 10), existing[0].id]
      );
    } else {
      await db.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, productId, parseInt(quantity, 10)]
      );
    }

    return res.json({ success: true, message: `"${product[0].title}" added to your cart!` });
  } catch (err) {
    console.error('[addToCart Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to add item to cart.' });
  }
}

// UPDATE CART ITEM QUANTITY
async function updateQuantity(req, res) {
  try {
    const userId = req.user.id;
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    const newQty = parseInt(quantity, 10);

    if (newQty <= 0) {
      await db.query('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [cartItemId, userId]);
      return res.json({ success: true, message: 'Item removed from cart.' });
    }

    await db.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
      [newQty, cartItemId, userId]
    );

    return res.json({ success: true, message: 'Cart updated.' });
  } catch (err) {
    console.error('[updateQuantity Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to update quantity.' });
  }
}

// REMOVE FROM CART
async function removeFromCart(req, res) {
  try {
    const userId = req.user.id;
    const { cartItemId } = req.params;

    await db.query('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [cartItemId, userId]);

    return res.json({ success: true, message: 'Item removed from cart.' });
  } catch (err) {
    console.error('[removeFromCart Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to remove cart item.' });
  }
}

// CLEAR CART
async function clearCart(req, res) {
  try {
    const userId = req.user.id;
    await db.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    return res.json({ success: true, message: 'Cart cleared.' });
  } catch (err) {
    console.error('[clearCart Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to clear cart.' });
  }
}

module.exports = {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
};
