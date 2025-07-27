import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/home' || location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';
  return (
    <nav className="navbar-jp">
      <div className="navbar-logo">
        <span role="img" aria-label="sakura">🌸</span> Nihongo Flashcard
      </div>
      <div className="navbar-links">
        {isHome ? (
          <button disabled className="jp-btn-main navbar-btn-disabled">Trang chủ</button>
        ) : (
          <button className="jp-btn-main" onClick={() => navigate('/home')}>Trang chủ</button>
        )}
        <button
          className={`jp-btn-main${isDashboard ? ' navbar-btn-disabled' : ''}`}
          onClick={() => !isDashboard && navigate('/dashboard')}
          disabled={isDashboard}
          style={{ marginLeft: 8 }}
        >
          Quản lý bộ Flashcard
        </button>
        <button className="jp-btn-main" onClick={() => navigate('/quiz')} style={{ marginLeft: 8 }}>
          Ôn tập
        </button>
        {user ? (
          <>
            <span className="navbar-user">Xin chào, {user.username}</span>
            <button onClick={onLogout} className="jp-btn-main" style={{ marginLeft: 8 }}>Đăng xuất</button>
          </>
        ) : (
          <>
            <button className="jp-btn-main" onClick={() => navigate('/login')}>Đăng nhập</button>
            <button className="jp-btn-main" onClick={() => navigate('/register')} style={{ marginLeft: 8 }}>Đăng ký</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 