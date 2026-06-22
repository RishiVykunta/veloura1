import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Shop from './pages/shop/Shop';
import ProductDetail from './pages/product/ProductDetail';
import Wishlist from './pages/wishlist/Wishlist';
import Collections from './pages/collections/Collections';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/profile/Profile';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import ProductEdit from './pages/admin/ProductEdit';
import ProductList from './pages/admin/ProductList';
import OrdersList from './pages/admin/OrdersList';
import CustomersList from './pages/admin/CustomersList';
import CouponsList from './pages/admin/CouponsList';
import ReviewsList from './pages/admin/ReviewsList';
import BannersList from './pages/admin/BannersList';
import AnalyticsView from './pages/admin/AnalyticsView';
import NotificationsView from './pages/admin/NotificationsView';
import SettingsView from './pages/admin/SettingsView';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Customer Storefront Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="product/:slug" element={<ProductDetail />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="collections" element={<Collections />} />
            
            {/* Auth Routes */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductEdit />} />
            <Route path="orders" element={<OrdersList />} />
            <Route path="customers" element={<CustomersList />} />
            <Route path="coupons" element={<CouponsList />} />
            <Route path="reviews" element={<ReviewsList />} />
            <Route path="banners" element={<BannersList />} />
            <Route path="analytics" element={<AnalyticsView />} />
            <Route path="notifications" element={<NotificationsView />} />
            <Route path="settings" element={<SettingsView />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
