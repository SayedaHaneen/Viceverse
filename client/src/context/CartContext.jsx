import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [cart, setCart] = useState({
    items: [],
    itemCount: 0,
    subtotal: 0,
    total: 0,
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load cart from DB if logged in, or localStorage if guest
  const fetchCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        const res = await api.getCart();
        if (res.success && res.cart) {
          setCart(res.cart);
        }
      } catch (err) {
        console.error('Failed to load cart from DB:', err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Local storage guest cart
      try {
        const saved = localStorage.getItem('viceverse_guest_cart');
        if (saved) {
          const parsed = JSON.parse(saved);
          const subtotal = parsed.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
          setCart({
            items: parsed,
            itemCount: parsed.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: parseFloat(subtotal.toFixed(2)),
            total: parseFloat(subtotal.toFixed(2)),
          });
        }
      } catch (e) {
        console.warn('Error reading guest cart');
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add product to cart
  const addToCart = async (product, quantity = 1) => {
    try {
      if (isAuthenticated) {
        await api.addToCart(product.id, quantity);
        await fetchCart();
      } else {
        // Guest mode
        setCart((prev) => {
          const existingIndex = prev.items.findIndex((i) => (i.product_id || i.id) === product.id);
          let newItems = [...prev.items];
          if (existingIndex > -1) {
            newItems[existingIndex].quantity += quantity;
          } else {
            newItems.push({
              cart_item_id: 'guest-' + Date.now(),
              product_id: product.id,
              id: product.id,
              title: product.title,
              slug: product.slug,
              price: product.price,
              original_price: product.original_price,
              preview_image: product.preview_image,
              file_type: product.file_type,
              category_name: product.category_name,
              seller_username: product.seller_username,
              quantity,
            });
          }
          const subtotal = newItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
          localStorage.setItem('viceverse_guest_cart', JSON.stringify(newItems));
          return {
            items: newItems,
            itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: parseFloat(subtotal.toFixed(2)),
            total: parseFloat(subtotal.toFixed(2)),
          };
        });
      }
      addToast(`"${product.title}" added to your cart!`, 'success');
      setIsCartOpen(true);
    } catch (err) {
      console.error('Error adding to cart:', err);
      addToast(err.message || 'Could not add to cart', 'error');
    }
  };

  // Update quantity
  const updateQuantity = async (cartItemId, newQty) => {
    try {
      if (isAuthenticated) {
        await api.updateCartQty(cartItemId, newQty);
        await fetchCart();
      } else {
        setCart((prev) => {
          let newItems;
          if (newQty <= 0) {
            newItems = prev.items.filter((i) => i.cart_item_id !== cartItemId);
          } else {
            newItems = prev.items.map((i) =>
              i.cart_item_id === cartItemId ? { ...i, quantity: newQty } : i
            );
          }
          const subtotal = newItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
          localStorage.setItem('viceverse_guest_cart', JSON.stringify(newItems));
          return {
            items: newItems,
            itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: parseFloat(subtotal.toFixed(2)),
            total: parseFloat(subtotal.toFixed(2)),
          };
        });
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  // Remove single item
  const removeFromCart = async (cartItemId) => {
    try {
      if (isAuthenticated) {
        await api.removeFromCart(cartItemId);
        await fetchCart();
      } else {
        setCart((prev) => {
          const newItems = prev.items.filter((i) => i.cart_item_id !== cartItemId);
          const subtotal = newItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
          localStorage.setItem('viceverse_guest_cart', JSON.stringify(newItems));
          return {
            items: newItems,
            itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: parseFloat(subtotal.toFixed(2)),
            total: parseFloat(subtotal.toFixed(2)),
          };
        });
      }
      addToast('Item removed from cart.', 'info');
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await api.clearCart();
      }
      localStorage.removeItem('viceverse_guest_cart');
      setCart({
        items: [],
        itemCount: 0,
        subtotal: 0,
        total: 0,
      });
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
