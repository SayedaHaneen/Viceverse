// Centralized API Service for VICEVERSE with Seamless Cloud Fallback
import { mockCategories, mockCreators, mockProducts, mockUsers } from './mockData';

const BASE_URL = '/api';

export function getAuthToken() {
  return localStorage.getItem('viceverse_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('viceverse_token', token);
  } else {
    localStorage.removeItem('viceverse_token');
  }
}

// Fallback handler for zero-card static cloud environments (Vercel, Netlify, GitHub Pages)
function handleMockFallback(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const cleanEndpoint = endpoint.split('?')[0];
  const urlParams = new URLSearchParams(endpoint.includes('?') ? endpoint.split('?')[1] : '');

  // Auth me
  if (cleanEndpoint === '/auth/me') {
    const storedUser = localStorage.getItem('viceverse_user');
    if (storedUser) {
      try {
        return { success: true, user: JSON.parse(storedUser) };
      } catch (e) {}
    }
    return { success: true, user: mockUsers[0] };
  }

  // Auth login
  if (cleanEndpoint === '/auth/login' && method === 'POST') {
    let body = {};
    try { body = JSON.parse(options.body || '{}'); } catch (e) {}
    const matched = mockUsers.find(u => u.email.toLowerCase() === (body.email || '').toLowerCase()) || {
      id: 99,
      full_name: "Vice Explorer",
      username: (body.email || 'user').split('@')[0],
      email: body.email,
      role: body.email?.includes('admin') ? 'admin' : (body.email?.includes('creator') ? 'creator' : 'user'),
      avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80"
    };
    localStorage.setItem('viceverse_user', JSON.stringify(matched));
    return {
      success: true,
      token: 'demo-token-' + Date.now(),
      user: matched,
      message: 'Logged in successfully (Cloud Demo Mode)'
    };
  }

  // Categories
  if (cleanEndpoint === '/products/categories') {
    return { success: true, categories: mockCategories };
  }

  // Products list
  if (cleanEndpoint === '/products') {
    let list = [...mockProducts];
    const cat = urlParams.get('category');
    const search = urlParams.get('search');
    if (cat && cat !== 'all') {
      list = list.filter(p => p.category_slug === cat || String(p.category_id) === cat);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.tags.toLowerCase().includes(q));
    }
    return { success: true, count: list.length, products: list };
  }

  // Single Product
  if (cleanEndpoint.startsWith('/products/')) {
    const slug = cleanEndpoint.replace('/products/', '');
    const prod = mockProducts.find(p => p.slug === slug || String(p.id) === slug) || mockProducts[0];
    return { success: true, product: prod, creator: mockCreators[0] };
  }

  // Creators list
  if (cleanEndpoint === '/creators') {
    let list = [...mockCreators];
    const district = urlParams.get('district');
    const search = urlParams.get('search');
    if (district && district !== 'All') {
      list = list.filter(c => c.district === district);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => c.display_name.toLowerCase().includes(q) || c.username.toLowerCase().includes(q));
    }
    return { success: true, count: list.length, creators: list };
  }

  // Single Creator
  if (cleanEndpoint.startsWith('/creators/')) {
    const uname = cleanEndpoint.replace('/creators/', '');
    const creator = mockCreators.find(c => c.username.toLowerCase() === uname.toLowerCase()) || mockCreators[0];
    const creatorProds = mockProducts.filter(p => p.seller_id === creator.id);
    return {
      success: true,
      creator: {
        ...creator,
        portfolio: [
          { id: 1, title: "Neon Skyline 8K", category: "Wallpapers", image_url: creator.cover_url, likes_count: 1420 },
          { id: 2, title: "Vice Night Drive", category: "Stream Assets", image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80", likes_count: 890 }
        ],
        products: creatorProds,
        socials: [
          { platform: "Twitch", url: "https://twitch.tv" },
          { platform: "YouTube", url: "https://youtube.com" },
          { platform: "Twitter", url: "https://x.com" }
        ]
      }
    };
  }

  // Cart
  if (cleanEndpoint === '/cart') {
    const savedCart = JSON.parse(localStorage.getItem('viceverse_cart') || '[]');
    const subtotal = savedCart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    return {
      success: true,
      cart: {
        items: savedCart,
        subtotal: parseFloat(subtotal.toFixed(2)),
        total: parseFloat(subtotal.toFixed(2)),
        itemCount: savedCart.reduce((sum, i) => sum + i.quantity, 0)
      }
    };
  }

  if (cleanEndpoint === '/cart/add') {
    let body = {};
    try { body = JSON.parse(options.body || '{}'); } catch (e) {}
    const prod = mockProducts.find(p => p.id === body.productId) || mockProducts[0];
    let savedCart = JSON.parse(localStorage.getItem('viceverse_cart') || '[]');
    const existing = savedCart.find(i => i.product_id === prod.id);
    if (existing) {
      existing.quantity += (body.quantity || 1);
    } else {
      savedCart.push({
        id: Date.now(),
        product_id: prod.id,
        title: prod.title,
        price: prod.price,
        preview_image: prod.preview_image,
        quantity: body.quantity || 1,
        file_type: prod.file_type
      });
    }
    localStorage.setItem('viceverse_cart', JSON.stringify(savedCart));
    const subtotal = savedCart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    return {
      success: true,
      cart: {
        items: savedCart,
        subtotal: parseFloat(subtotal.toFixed(2)),
        total: parseFloat(subtotal.toFixed(2)),
        itemCount: savedCart.reduce((sum, i) => sum + i.quantity, 0)
      }
    };
  }

  if (cleanEndpoint === '/cart/clear') {
    localStorage.removeItem('viceverse_cart');
    return { success: true, cart: { items: [], subtotal: 0, total: 0, itemCount: 0 } };
  }

  if (cleanEndpoint.startsWith('/cart/item/')) {
    const id = cleanEndpoint.replace('/cart/item/', '');
    let savedCart = JSON.parse(localStorage.getItem('viceverse_cart') || '[]');
    if (method === 'DELETE') {
      savedCart = savedCart.filter(i => String(i.id) !== String(id));
    } else if (method === 'PUT') {
      let body = {};
      try { body = JSON.parse(options.body || '{}'); } catch (e) {}
      const item = savedCart.find(i => String(i.id) === String(id));
      if (item && body.quantity) {
        item.quantity = body.quantity;
      }
    }
    localStorage.setItem('viceverse_cart', JSON.stringify(savedCart));
    const subtotal = savedCart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    return {
      success: true,
      cart: {
        items: savedCart,
        subtotal: parseFloat(subtotal.toFixed(2)),
        total: parseFloat(subtotal.toFixed(2)),
        itemCount: savedCart.reduce((sum, i) => sum + i.quantity, 0)
      }
    };
  }

  // Checkout Demo Order
  if (cleanEndpoint === '/orders/checkout') {
    const orderId = 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    localStorage.removeItem('viceverse_cart');
    return {
      success: true,
      message: 'Demo order processed successfully!',
      order: {
        id: Date.now(),
        order_number: orderId,
        status: 'completed',
        created_at: new Date().toISOString()
      }
    };
  }

  // Admin stats
  if (cleanEndpoint === '/admin/stats') {
    return {
      success: true,
      stats: {
        totalRevenue: 48920.50,
        totalOrders: 1428,
        activeCreators: 48,
        totalProducts: 156,
        growthRate: "+18.4%"
      }
    };
  }

  return { success: true };
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      // If 404 or server error in cloud static deployment, fall back gracefully
      if (response.status === 404 || response.status >= 500) {
        return handleMockFallback(endpoint, options);
      }
      const data = await response.json().catch(() => ({}));
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return await response.json();
  } catch (err) {
    // If network error (offline backend, static Vercel host, etc.)
    return handleMockFallback(endpoint, options);
  }
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),
  updateMe: (body) => request('/auth/me', { method: 'PUT', body: JSON.stringify(body) }),

  // Creators
  getCreators: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/creators${query ? `?${query}` : ''}`);
  },
  getCreator: (username) => request(`/creators/${username}`),
  updateCreatorProfile: (body) => request('/creators/profile/update', { method: 'PUT', body: JSON.stringify(body) }),
  uploadMedia: (formData) => request('/creators/upload', { method: 'POST', body: formData }),
  addPortfolioItem: (body) => request('/creators/portfolio', { method: 'POST', body: JSON.stringify(body) }),
  deletePortfolioItem: (id) => request(`/creators/portfolio/${id}`, { method: 'DELETE' }),
  updateSocialLinks: (links) => request('/creators/social-links', { method: 'PUT', body: JSON.stringify({ links }) }),

  // Products & Categories
  getProducts: (params = {}) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '' && v !== 'all')
    );
    const query = new URLSearchParams(cleanParams).toString();
    return request(`/products${query ? `?${query}` : ''}`);
  },
  getProduct: (slug) => request(`/products/${slug}`),
  getCategories: () => request('/products/categories'),
  getSavedProducts: () => request('/products/user/saved'),
  toggleSaveProduct: (productId) => request('/products/user/toggle-save', { method: 'POST', body: JSON.stringify({ productId }) }),
  createProduct: (body) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id, body) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  // Cart
  getCart: () => request('/cart'),
  addToCart: (productId, quantity = 1) => request('/cart/add', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  updateCartQty: (cartItemId, quantity) => request(`/cart/item/${cartItemId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  removeFromCart: (cartItemId) => request(`/cart/item/${cartItemId}`, { method: 'DELETE' }),
  clearCart: () => request('/cart/clear', { method: 'DELETE' }),

  // Orders & Demo Checkout
  createDemoOrder: (body) => request('/orders/checkout', { method: 'POST', body: JSON.stringify(body) }),
  getMyOrders: () => request('/orders/my-orders'),
  getOrder: (identifier) => request(`/orders/${identifier}`),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAllUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/users${query ? `?${query}` : ''}`);
  },
  updateUser: (id, body) => request(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
  getAllOrders: () => request('/admin/orders'),
  updateOrderStatus: (id, status) => request(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  createCategory: (body) => request('/admin/categories', { method: 'POST', body: JSON.stringify(body) }),
  updateCategory: (id, body) => request(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCategory: (id) => request(`/admin/categories/${id}`, { method: 'DELETE' }),
};
