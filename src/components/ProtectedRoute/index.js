// src/components/ProtectedRoute/index.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  // Nếu chưa login, chuyển về /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  // Nếu đã login, render component con
  return children;
};

export default ProtectedRoute;
