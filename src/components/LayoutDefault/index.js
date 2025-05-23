import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Cập nhật theo cấu trúc thư mục thật của bạn


const LayoutDefault = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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

          {user?.role === 'admin' && (
            <button className="admin-button" onClick={() => navigate('/admin')}>
              🛠️ Quản trị
            </button>
          )}

          {/* 👇 Thêm nút Đăng xuất */}
          {user && (
            <button className="logout-button" onClick={() => {
              logout();
              navigate('/');
            }}>
              🚪 Đăng xuất
            </button>
          )}
        </div>
      </header>

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
