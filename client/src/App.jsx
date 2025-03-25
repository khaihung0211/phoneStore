import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './pages/public/ProductDetail';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected pages
import AddressInput from './pages/AddressInput';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';

// Admin pages
import DashboardPage from './pages/admin/DashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import NewProductPage from './pages/admin/Product/NewProduct';
import EditProductPage from './pages/admin/Product/EditProductPage';
import OrderDetail from './pages/OrderDetail';
import MyOrders from './pages/MyOrders';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="product/:productId" element={<ProductDetail />} />
              <Route path="cart" element={<CartPage />} />

              <Route path="address" element={
                <ProtectedRoute>
                  <AddressInput />
                </ProtectedRoute>
              } />
              <Route path="checkout" element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } />
              <Route path="order-success" element={
                <ProtectedRoute>
                  <OrderSuccessPage />
                </ProtectedRoute>
              } />
              <Route path="my-orders" element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              } />
              <Route path="orders/:id" element={
                <ProtectedRoute>
                  <OrderDetail />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />

              <Route path="*" element={<NotFoundPage />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="products/new" element={<NewProductPage />} />
              <Route path="products/:id/edit" element={<EditProductPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="users" element={<AdminUsersPage />} />

              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
