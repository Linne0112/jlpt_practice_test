import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './style.css';

const LayoutDefault = () => {
  const navigate = useNavigate();

  return (
    <div className="layout-default">
      <header className="header">
        <h1 className="logo" onClick={() => navigate('/')}>
          JLPT Practice
        </h1>

        <div className="header-actions">
          <button className="home-button" onClick={() => navigate('/')}>
            🏠 Trang chủ
          </button>

          <button className="account-button" onClick={() => navigate('/account')}>
            👤 Account 
          </button>
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
