import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { loginUser } from '../services/api';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginUser(email, password);
      if (data.msg === 'Login success') {
        if (setUser && data.user) setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess(true);
        setTimeout(() => navigate('/home'), 800);
      } else {
        setError(data.msg || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError('Lỗi kết nối server');
    }
  };

  return (
    <div className="jp-bg">
      <div className="login-container-jp">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Nhập email"
          />
          <label>Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
          />
          <button type="submit">Đăng nhập</button>
        </form>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        <div className="jp-link">
          <a href="/register">Chưa có tài khoản? Đăng ký</a>
        </div>
      </div>
      {success && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '2.5rem 2.5rem', boxShadow: '0 8px 32px #43a04733', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12, color: '#43a047' }}>✔</div>
            <div style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>Đăng nhập thành công!</div>
            <div style={{ color: '#4a4e69' }}>Bạn sẽ được chuyển vào trang học tập...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
