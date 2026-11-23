import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import DiscoverCreators from './pages/DiscoverCreators';
import CreatorProfile from './pages/CreatorProfile';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatorDashboard from './pages/CreatorDashboard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#080A12] text-white selection:bg-[#FF4FA3] selection:text-white relative">
      <Navbar />
      <CartDrawer />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/creators" element={<DiscoverCreators />} />
          <Route path="/creator/:username" element={<CreatorProfile />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Creator Dashboard (Protected) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireRole="creator">
                <CreatorDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Admin Panel (Protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
