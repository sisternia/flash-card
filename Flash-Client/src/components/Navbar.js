import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import Profile from '../pages/Profile';
import { getUserProfile } from '../services/api';

const Navbar = ({ user, onLogout, onUpdateUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/home' || location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';
  const isQuizUser = location.pathname === '/quiz-user';
  const [showProfile, setShowProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    setCurrentUser(user); // Sync with prop changes
  }, [user]);

  useEffect(() => {
    if (showProfile) {
      const fetchUserProfile = async () => {
        try {
          const data = await getUserProfile(user.id);
          setCurrentUser({ ...user, username: data.username });
          onUpdateUser({ ...user, username: data.username }); // Update parent state
          localStorage.setItem('user', JSON.stringify({ ...user, username: data.username })); // Update localStorage
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      };
      fetchUserProfile();
    }
  }, [showProfile, user, onUpdateUser]);

  return (
    <>
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
          <button
            className={`jp-btn-main${isQuizUser ? ' navbar-btn-disabled' : ''}`}
            onClick={() => !isQuizUser && navigate('/quiz-user')}
            disabled={isQuizUser}
            style={{ marginLeft: 8 }}
          >
            Ôn tập
          </button>
          {currentUser ? (
            <>
              <button
                className="jp-btn-main"
                onClick={() => setShowProfile(true)}
                style={{ marginLeft: 8 }}
              >
                Xin chào, {currentUser.username}
              </button>
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
      {showProfile && <Profile user={currentUser} onClose={() => setShowProfile(false)} onUpdateUser={(updatedUser) => {
        setCurrentUser(updatedUser);
        onUpdateUser(updatedUser);
      }} />}
    </>
  );
};

export default Navbar;  