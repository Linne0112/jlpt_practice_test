import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Cập nhật theo cấu trúc thư mục thật của bạn


const LayoutDefault = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="layout-default">
      <header className="header">
        <h1 className="logo" onClick={() => navigate(user.role === 'admin' ? '/admin' : '/')}>
          JLPT練習システム
        </h1>

        <div className="header-actions">
          <button className="home-button" onClick={() => navigate(user.role === 'admin' ? '/admin' : '/')}>
            {user.role === 'admin' ?"🏠 Trang chủ": "🏠 ホーム "}
          </button>
          {
            user.role !== 'admin' && (
              <button className="account-button" onClick={() => navigate('/account')}>
                👤  アカウント
              </button>
            )
          }
          

          {user.role === 'admin' && (
            <button className="admin-button" onClick={() => navigate('/admin')}>
              🛠️ Quản lý
            </button>
          )}

          {/* 👇 Thêm nút Đăng xuất */}
          {user && (
            <button className="logout-button" onClick={() => {
              logout();
              navigate('/');
            }}>
              {user.role === 'admin' ?"🏠 Đăng xuất": "🚪 ログアウト "}
            </button>
          )}
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>© 2025 JLPT練習システム</p>
      </footer>
    </div>
  );
};

export default LayoutDefault;
