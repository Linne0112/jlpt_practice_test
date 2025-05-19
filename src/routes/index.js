// src/routes/index.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';

import LoginPage    from '../page/Login';
import HomePage     from '../page/Home';
import ExamPage     from '../page/Exam';
import TestPage     from '../page/Test';
import RegisterPage from '../page/Register';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* Route công khai */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Route bảo vệ */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam"
          element={
            <ProtectedRoute>
              <ExamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test"
          element={
            <ProtectedRoute>
              <TestPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default AppRoutes;
