// src/App.js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AllRoute from './components/AllRoute'; // ✅ Import route chính đã cấu hình

function App() {
  return (
    <AuthProvider> {/* ✅ Bọc toàn bộ app với context đăng nhập */}
      <BrowserRouter>
        <AllRoute /> {/* ✅ Dùng đúng routes đã cấu trúc trong AllRoute */}
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
