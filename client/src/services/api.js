// Centralized API Service for VICEVERSE
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

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
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
