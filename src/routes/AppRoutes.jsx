import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";

// Public Pages
import HomePage from "../pages/HomePage";
import ProductsPage from "../pages/ProductsPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import CheckoutPage from "../pages/CheckoutPage";

// Admin Pages
import AdminLoginPage from "../pages/AdminLoginPage";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import ManageProductsPage from "../pages/ManageProductsPage";
import ProductFormPage from "../pages/ProductFormPage";
import ManageCategoriesPage from "../pages/ManageCategoriesPage";
import ManageSlidersPage from "../pages/ManageSlidersPage";
import ManageSettingsPage from "../pages/ManageSettingsPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="category/:categorySlug" element={<ProductsPage />} />
        <Route path="product/:slug" element={<ProductDetailsPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
      </Route>

      {/* Admin Login Route */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="products" element={<ManageProductsPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/edit/:id" element={<ProductFormPage />} />
          <Route path="categories" element={<ManageCategoriesPage />} />
          <Route path="sliders" element={<ManageSlidersPage />} />
          <Route path="settings" element={<ManageSettingsPage />} />
        </Route>
      </Route>

      {/* Fallback Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
