// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LayoutDefault from './components/LayoutDefault';

import LoginPage    from './page/Login';
import HomePage     from './page/Home';
import ExamPage     from './page/Exam';
import TestPage     from './page/Test';
import AccountPage  from './page/Account';   // ← import mới

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Route công khai */}
          <Route path="/login" element={<LoginPage />} />

          {/* Route bảo vệ + layout chứa Outlet */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <LayoutDefault />   {/* Header có nút Trang chủ + Account */}
              </ProtectedRoute>
            }
          >
            {/* Route con (hiển thị qua <Outlet/>) */}
            <Route index element={<HomePage />} />
            <Route path="exam/:level" element={<ExamPage />} />
            <Route path="test/:id"   element={<TestPage />} />
            <Route path="account"    element={<AccountPage />} /> {/* ← thêm dòng này */}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
