import React, { useEffect, useRef } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Quiz from './pages/Quiz';
import Register from './pages/Register';
import SetDetail from './pages/SetDetail';

function App() {
  const [user, setUser] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [showBackToLoginConfirm, setShowBackToLoginConfirm] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const prevPath = useRef(location.pathname);
  const nodeRef = useRef(null);

  useEffect(() => {
    const checkUser = async () => {
      if (!user || !user.email) return;
      try {
        const res = await fetch('http://localhost:5000/api/auth/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email })
        });
        if (!res.ok) throw new Error('User not valid');
      } catch {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/');
      }
    };
    checkUser();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (user && location.pathname === '/login' && prevPath.current !== '/login') {
      setShowBackToLoginConfirm(true);
    }
    prevPath.current = location.pathname;
    // eslint-disable-next-line
  }, [location.pathname, user]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };
  const confirmLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setShowLogoutConfirm(false);
    navigate('/');
  };
  const cancelLogout = () => setShowLogoutConfirm(false);

  const confirmBackToLogin = () => {
    setUser(null);
    localStorage.removeItem('user');
    setShowBackToLoginConfirm(false);
    navigate('/login');
  };
  const cancelBackToLogin = () => {
    setShowBackToLoginConfirm(false);
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
    navigate('/home');
  };

  return (
    <>
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <SwitchTransition mode="out-in">
        <CSSTransition key={location.pathname} classNames="slide" timeout={400} nodeRef={nodeRef}>
          <div className="route-wrapper" ref={nodeRef}>
            <Routes location={location}>
              <Route path="/" element={user ? <Home /> : <Landing />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/set/:id" element={<SetDetail />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/home" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </CSSTransition>
      </SwitchTransition>

      {/* Confirm logout */}
      {showLogoutConfirm && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.25)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:16,padding:'2.5rem 2.5rem',boxShadow:'0 8px 32px #e6394633',textAlign:'center'}}>
            <div style={{fontSize:32,marginBottom:12,color:'#e63946'}}>Bạn có chắc muốn đăng xuất?</div>
            <div style={{display:'flex',justifyContent:'center',gap:16,marginTop:16}}>
              <button style={{background:'#e63946',color:'#fff',border:'none',borderRadius:8,padding:'0.6rem 1.5rem',fontWeight:'bold',cursor:'pointer'}} onClick={confirmLogout}>Đăng xuất</button>
              <button style={{background:'#bfc0c0',color:'#222',border:'none',borderRadius:8,padding:'0.6rem 1.5rem',fontWeight:'bold',cursor:'pointer'}} onClick={cancelLogout}>Huỷ</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm back to login */}
      {showBackToLoginConfirm && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.25)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:16,padding:'2.5rem 2.5rem',boxShadow:'0 8px 32px #e6394633',textAlign:'center'}}>
            <div style={{fontSize:22,fontWeight:'bold',marginBottom:8}}>Bạn sẽ thoát ra trang Login nếu quay lại</div>
            <div style={{color:'#4a4e69',marginBottom:16}}>Bạn có chắc muốn đăng xuất không?</div>
            <div style={{display:'flex',justifyContent:'center',gap:16}}>
              <button style={{background:'#e63946',color:'#fff',border:'none',borderRadius:8,padding:'0.6rem 1.5rem',fontWeight:'bold',cursor:'pointer'}} onClick={confirmBackToLogin}>Đăng xuất</button>
              <button style={{background:'#bfc0c0',color:'#222',border:'none',borderRadius:8,padding:'0.6rem 1.5rem',fontWeight:'bold',cursor:'pointer'}} onClick={cancelBackToLogin}>Huỷ</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
