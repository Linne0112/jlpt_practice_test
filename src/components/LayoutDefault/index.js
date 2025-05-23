// src/components/LayoutDefault/index.js
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './style.css';

const LayoutDefault = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="layout-default">
      <header className="header">
        <h1 className="logo" onClick={() => navigate(user?.name === 'admin' ? '/admin' : '/')}>
          JLPT Practice
        </h1>

        <div className="header-actions">
          <button className="home-button" onClick={() => navigate(user?.name === 'admin' ? '/admin' : '/')}>
            🏠 Trang chủ
          </button>

          <button className="account-button" onClick={() => navigate('/account')}>
            👤 Account
          </button>

          {/* 👇 Nếu là admin thì hiển thị thêm nút quản trị */}
          {user?.name === 'admin' && (
            <button className="admin-button" onClick={() => navigate('/admin')}>
              🛠️ Quản trị
            </button>
          )}
        </div>
      </header>

      {/* <Outlet /> để hiển thị route con */}
      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>© 2025 JLPT Practice System</p>
      </footer>
    </div>
  );
};

export default LayoutDefault;
