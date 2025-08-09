import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repass, setRepass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !username || !password || !repass) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (password !== repass) {
      setError('Mật khẩu nhập lại không khớp');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/'), 1500);
      } else {
        setError(data.msg || 'Đăng ký thất bại');
      }
    } catch (err) {
      setError('Lỗi kết nối server');
    }
  };

  return (
    <div className="jp-bg">
      <div className="register-container-jp">
        <h2>Đăng ký</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Nhập email"
          />
          <label>Tên người dùng</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Nhập tên người dùng"
          />
          <label>Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
          />
          <label>Nhập lại mật khẩu</label>
          <input
            type="password"
            value={repass}
            onChange={e => setRepass(e.target.value)}
            placeholder="Nhập lại mật khẩu"
          />
          <button type="submit">Đăng ký</button>
        </form>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        <div className="jp-link">
          <a href="/login">Đã có tài khoản? Đăng nhập</a>
        </div>
      </div>
      {success && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '2.5rem 2.5rem', boxShadow: '0 8px 32px #e6394633', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12, color: '#43a047' }}>✔</div>
            <div style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>Đăng ký thành công!</div>
            <div style={{ color: '#4a4e69' }}>Bạn sẽ được chuyển về trang chủ...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;