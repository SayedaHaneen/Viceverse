import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { 
  ShieldCheck, 
  Users, 
  Package, 
  ShoppingBag, 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Search,
  X,
  Save,
  Tag
} from 'lucide-react';

export default function AdminPanel() {
  const { user, isAdmin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    category_id: 1,
    price: '',
    original_price: '',
    description: '',
    preview_image: '',
    file_type: 'ZIP / PSD / PNG',
    file_size_mb: '45.0',
    tags: '',
    is_featured: false,
    is_trending: false,
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'Sparkles',
    sort_order: 1,
  });

  // Verify admin access
  useEffect(() => {
    if (!isAdmin) {
      addToast('Access denied. Administrator privileges required.', 'error');
      navigate('/');
    }
  }, [isAdmin, navigate, addToast]);

  // Load Admin Data
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, prodRes, ordersRes, catRes] = await Promise.all([
        api.getAdminStats(),
        api.getAllUsers(),
        api.getProducts(),
        api.getAllOrders(),
        api.getCategories(),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsersList(usersRes.users);
      if (prodRes.success) setProductsList(prodRes.products);
      if (ordersRes.success) setOrdersList(ordersRes.orders);
      if (catRes.success) setCategoriesList(catRes.categories);
    } catch (err) {
      console.error('Error loading admin data:', err);
      addToast(err.message || 'Failed to fetch admin data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  // USER ACTIONS
  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await api.updateUser(userId, { role: newRole });
      addToast(`User role updated to '${newRole}'.`, 'success');
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      addToast(err.message || 'Failed to update user.', 'error');
    }
  };

  const handleToggleVerified = async (userId, currentVal) => {
    try {
      await api.updateUser(userId, { is_verified: !currentVal });
      addToast('Verification badge toggled.', 'success');
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_verified: !currentVal } : u))
      );
    } catch (err) {
      addToast(err.message || 'Failed to update user.', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.deleteUser(userId);
      addToast('User deleted.', 'info');
      setUsersList((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      addToast(err.message || 'Failed to delete user.', 'error');
    }
  };

  // PRODUCT ACTIONS
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productForm);
        addToast('Product updated successfully!', 'success');
      } else {
        await api.createProduct(productForm);
        addToast('New product added to marketplace!', 'success');
      }
      setShowProductModal(false);
      setEditingProduct(null);
      loadAdminData();
    } catch (err) {
      addToast(err.message || 'Failed to save product.', 'error');
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await api.deleteProduct(prodId);
      addToast('Product deleted from marketplace.', 'info');
      setProductsList((prev) => prev.filter((p) => p.id !== prodId));
    } catch (err) {
      addToast(err.message || 'Failed to delete product.', 'error');
    }
  };

  // ORDER ACTIONS
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      addToast(`Order status updated to ${newStatus}.`, 'success');
      setOrdersList((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      addToast(err.message || 'Failed to update order status.', 'error');
    }
  };

  // CATEGORY ACTIONS
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await api.createCategory(categoryForm);
      addToast('Category created!', 'success');
      setShowCategoryModal(false);
      setCategoryForm({ name: '', slug: '', description: '', icon: 'Sparkles', sort_order: 1 });
      loadAdminData();
    } catch (err) {
      addToast(err.message || 'Failed to create category.', 'error');
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.deleteCategory(catId);
      addToast('Category deleted.', 'info');
      setCategoriesList((prev) => prev.filter((c) => c.id !== catId));
    } catch (err) {
      addToast(err.message || 'Failed to delete category.', 'error');
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#35DDF5]/15 text-[#35DDF5] text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> High Authority Zone
          </div>
          <h1 className="font-anton text-3xl sm:text-4xl uppercase tracking-wide text-white">
            ADMINISTRATOR <span className="gradient-text-vice">CONTROL PANEL</span>
          </h1>
          <p className="text-xs text-[#A3A9BA] mt-1">
            Global governance over users, verified creators, digital inventory, and orders.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-[#35DDF5]"
        >
          Refresh Data
        </button>
      </div>

      {/* METRICS ROW */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#181126]/90 to-[#101421]/95 border border-white/10 hover:border-[#35DDF5]/40 transition-all shadow-lg">
            <span className="text-[10px] uppercase font-bold text-[#A3A9BA]">Total Users</span>
            <span className="font-anton text-3xl text-white block mt-1">{stats.totalUsers}</span>
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#181126]/90 to-[#101421]/95 border border-white/10 hover:border-[#FF4FA3]/40 transition-all shadow-lg">
            <span className="text-[10px] uppercase font-bold text-[#FF4FA3]">Creators</span>
            <span className="font-anton text-3xl text-white block mt-1">{stats.totalCreators}</span>
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#181126]/90 to-[#101421]/95 border border-white/10 hover:border-[#35DDF5]/40 transition-all shadow-lg">
            <span className="text-[10px] uppercase font-bold text-[#35DDF5]">Market Products</span>
            <span className="font-anton text-3xl text-white block mt-1">{stats.totalProducts}</span>
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#181126]/90 to-[#101421]/95 border border-white/10 hover:border-[#FF9B61]/40 transition-all shadow-lg">
            <span className="text-[10px] uppercase font-bold text-[#FF9B61]">Total Orders</span>
            <span className="font-anton text-3xl text-white block mt-1">{stats.totalOrders}</span>
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#181126]/90 to-[#101421]/95 border border-white/10 col-span-2 md:col-span-1 shadow-lg">
            <span className="text-[10px] uppercase font-bold text-emerald-400">Demo Revenue</span>
            <span className="font-anton text-3xl text-emerald-400 block mt-1">${stats.totalRevenue.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* TABS SELECTOR */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
            activeTab === 'users'
              ? 'bg-gradient-to-r from-[#FF4FA3] to-[#FF8642] text-white shadow-neon-pink'
              : 'bg-[#151B2B] text-[#A3A9BA] hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users & Creators ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
            activeTab === 'products'
              ? 'bg-gradient-to-r from-[#35DDF5] to-[#A855F7] text-white shadow-neon-cyan'
              : 'bg-[#151B2B] text-[#A3A9BA] hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products ({productsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
            activeTab === 'orders'
              ? 'bg-gradient-to-r from-[#FF9B61] to-[#FF4FA3] text-white shadow-neon-orange'
              : 'bg-[#151B2B] text-[#A3A9BA] hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders ({ordersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
            activeTab === 'categories'
              ? 'bg-white/15 text-white'
              : 'bg-[#151B2B] text-[#A3A9BA] hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Categories ({categoriesList.length})</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: USERS TABLE
      ======================================================== */}
      {activeTab === 'users' && (
        <div className="rounded-3xl bg-[#101421] border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-anton text-xl uppercase tracking-wider text-white">
              Registered Accounts & Creators
            </h3>
            <span className="text-xs text-[#A3A9BA]">
              Showing {usersList.length} accounts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#151B2B] text-[#A3A9BA] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">User</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Verified</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={u.username}
                          className="w-9 h-9 rounded-xl object-cover border border-white/10"
                        />
                        <div>
                          <strong className="text-white font-semibold block">{u.full_name}</strong>
                          <span className="text-[#FF4FA3] font-mono">@{u.username}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[#A3A9BA] font-mono">{u.email}</td>
                    <td className="py-4 px-6">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg bg-[#151B2B] border border-white/10 text-white font-bold uppercase text-[11px] focus:outline-none focus:border-[#35DDF5]"
                      >
                        <option value="user">USER</option>
                        <option value="creator">CREATOR</option>
                        <option value="admin">ADMIN</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      {u.role === 'creator' || u.display_name ? (
                        <button
                          onClick={() => handleToggleVerified(u.id, u.is_verified)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                            u.is_verified
                              ? 'bg-[#35DDF5]/20 text-[#35DDF5] border border-[#35DDF5]/40'
                              : 'bg-white/5 text-white/50 border border-white/10'
                          }`}
                        >
                          {u.is_verified ? 'Verified' : 'Unverified'}
                        </button>
                      ) : (
                        <span className="text-white/30 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {u.id !== user.id && (
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: PRODUCTS TABLE
      ======================================================== */}
      {activeTab === 'products' && (
        <div className="rounded-3xl bg-[#101421] border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-anton text-xl uppercase tracking-wider text-white">
              Marketplace Inventory
            </h3>
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  title: '',
                  category_id: categoriesList[0]?.id || 1,
                  price: '',
                  original_price: '',
                  description: '',
                  preview_image: '',
                  file_type: 'ZIP / PSD / PNG',
                  file_size_mb: '45.0',
                  tags: '',
                  is_featured: false,
                  is_trending: false,
                });
                setShowProductModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#FF8642] text-white font-bold text-xs uppercase tracking-wider shadow-neon-pink flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#151B2B] text-[#A3A9BA] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Price</th>
                  <th className="py-3.5 px-6">Seller</th>
                  <th className="py-3.5 px-6">Sales</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {productsList.map((prod) => (
                  <tr key={prod.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.preview_image}
                          alt={prod.title}
                          className="w-10 h-10 rounded-xl object-cover bg-black"
                        />
                        <div className="max-w-xs">
                          <strong className="text-white font-semibold block truncate">
                            {prod.title}
                          </strong>
                          <span className="text-[10px] text-white/50 font-mono">
                            {prod.file_type}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded-md bg-[#151B2B] text-[#35DDF5] font-semibold text-[10px] uppercase">
                        {prod.category_name}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-white">
                      ${Number(prod.price).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-[#A3A9BA]">
                      @{prod.seller_username}
                    </td>
                    <td className="py-4 px-6 text-white font-mono">
                      {prod.sales_count}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(prod);
                            setProductForm({
                              title: prod.title,
                              category_id: prod.category_id,
                              price: prod.price,
                              original_price: prod.original_price || '',
                              description: prod.description || '',
                              preview_image: prod.preview_image,
                              file_type: prod.file_type,
                              file_size_mb: prod.file_size_mb,
                              tags: prod.tags || '',
                              is_featured: !!prod.is_featured,
                              is_trending: !!prod.is_trending,
                            });
                            setShowProductModal(true);
                          }}
                          className="p-1.5 text-white/40 hover:text-[#35DDF5] transition-colors"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: ORDERS TABLE
      ======================================================== */}
      {activeTab === 'orders' && (
        <div className="rounded-3xl bg-[#101421] border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-anton text-xl uppercase tracking-wider text-white">
              Simulated Customer Orders
            </h3>
            <span className="text-xs text-[#A3A9BA]">
              {ordersList.length} Total Orders
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#151B2B] text-[#A3A9BA] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Order ID</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Total Amount</th>
                  <th className="py-3.5 px-6">Method</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ordersList.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#35DDF5]">
                      {order.order_number}
                    </td>
                    <td className="py-4 px-6">
                      <strong className="text-white block">{order.customer_name}</strong>
                      <span className="text-[#A3A9BA] text-[11px]">{order.customer_email}</span>
                    </td>
                    <td className="py-4 px-6 font-mono text-white font-bold">
                      ${Number(order.total_amount).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-[#A3A9BA] uppercase text-[10px]">
                      {order.payment_method?.replace('demo_', '')}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                          order.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : order.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        <option value="completed" className="bg-[#101421] text-white">COMPLETED</option>
                        <option value="pending" className="bg-[#101421] text-white">PENDING</option>
                        <option value="cancelled" className="bg-[#101421] text-white">CANCELLED</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-[#A3A9BA] text-[11px]">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: CATEGORIES
      ======================================================== */}
      {activeTab === 'categories' && (
        <div className="rounded-3xl bg-[#101421] border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-anton text-xl uppercase tracking-wider text-white">
              Marketplace Categories
            </h3>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#FF8642] text-white font-bold text-xs uppercase tracking-wider shadow-neon-pink flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#151B2B] text-[#A3A9BA] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Name</th>
                  <th className="py-3.5 px-6">Slug</th>
                  <th className="py-3.5 px-6">Icon</th>
                  <th className="py-3.5 px-6">Products</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {categoriesList.map((cat) => (
                  <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-bold text-white uppercase font-anton text-sm">
                      {cat.name}
                    </td>
                    <td className="py-4 px-6 text-[#35DDF5] font-mono">
                      {cat.slug}
                    </td>
                    <td className="py-4 px-6 text-[#A3A9BA]">
                      {cat.icon}
                    </td>
                    <td className="py-4 px-6 font-mono text-white">
                      {cat.product_count || 0}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          PRODUCT ADD / EDIT MODAL
      ======================================================== */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="max-w-2xl w-full bg-[#101421] rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setShowProductModal(false)}
              className="absolute top-5 right-5 p-2 text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-anton text-2xl uppercase text-white mb-6">
              {editingProduct ? 'Edit Marketplace Product' : 'Add New Digital Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#A3A9BA] mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vice Lights 8K OLED Wallpaper Pack"
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#151B2B] border border-white/10 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#A3A9BA] mb-1">Category</label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) => setProductForm({ ...productForm, category_id: parseInt(e.target.value, 10) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#151B2B] border border-white/10 text-xs text-white"
                  >
                    {categoriesList.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#A3A9BA] mb-1">Price ($USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="24.99"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#151B2B] border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#A3A9BA] mb-1">Original Price (For Discount Badge)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="39.99 (Optional)"
                    value={productForm.original_price}
                    onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#151B2B] border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#A3A9BA] mb-1">File Format / Specifications</label>
                  <input
                    type="text"
                    placeholder="e.g. ZIP (12x PNG 8K) or OBS Scene"
                    value={productForm.file_type}
                    onChange={(e) => setProductForm({ ...productForm, file_type: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#151B2B] border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#A3A9BA] mb-1">Preview Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={productForm.preview_image}
                  onChange={(e) => setProductForm({ ...productForm, preview_image: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#151B2B] border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#A3A9BA] mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the asset package, resolutions included, compatibility..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#151B2B] border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#A3A9BA] mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. 4K, 8K, Neon, OBS, GTA VI"
                  value={productForm.tags}
                  onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#151B2B] border border-white/10 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase text-white">
                  <input
                    type="checkbox"
                    checked={productForm.is_featured}
                    onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                    className="accent-[#FF4FA3]"
                  />
                  <span>Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase text-white">
                  <input
                    type="checkbox"
                    checked={productForm.is_trending}
                    onChange={(e) => setProductForm({ ...productForm, is_trending: e.target.checked })}
                    className="accent-[#35DDF5]"
                  />
                  <span>Mark as Trending</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 mt-4 rounded-xl bg-gradient-to-r from-[#FF4FA3] via-[#FF8642] to-[#FF4FA3] text-white font-bold text-xs uppercase tracking-widest shadow-neon-pink"
              >
                {editingProduct ? 'Save Product Changes' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          CATEGORY ADD MODAL
      ======================================================== */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-md w-full bg-[#101421] rounded-3xl border border-white/20 p-6 shadow-2xl relative">
            <button
              onClick={() => setShowCategoryModal(false)}
              className="absolute top-4 right-4 p-2 text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-anton text-xl uppercase text-white mb-4">
              Add New Category
            </h3>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#A3A9BA] mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sound Effects & Stems"
                  value={categoryForm.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setCategoryForm({ ...categoryForm, name, slug });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[#151B2B] border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#A3A9BA] mb-1">Slug</label>
                <input
                  type="text"
                  required
                  placeholder="sound-effects"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#151B2B] border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#A3A9BA] mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary..."
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#151B2B] border border-white/10 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#FF8642] text-white font-bold text-xs uppercase tracking-wider shadow-neon-pink"
              >
                Create Category
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
