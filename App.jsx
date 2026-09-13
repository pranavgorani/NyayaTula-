import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import { useAuth } from './context/AuthContext';

// Page imports
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ScanProduct from './pages/ScanProduct';
import ProductHistory from './pages/ProductHistory';
import ComplianceReport from './pages/ComplianceReport';
import Analytics from './pages/Analytics';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Route */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
      />

      {/* Protected Routes wrapped in Layout */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/scan" element={<ScanProduct />} />
        <Route path="/products" element={<ProductHistory />} />
        <Route path="/products/:id" element={<ComplianceReport />} />
        <Route path="/analytics" element={<Analytics />} />
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
