import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile = ({ user, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/profile/${user.id}`);
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchUserInfo();
  }, [user.id]);

  const handleRename = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/update-username/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newUsername }),
      });
      const data = await response.json();
      setMessage(data.msg);
      if (response.ok) {
        setShowRenameModal(false);
        setUserData(prev => ({ ...prev, username: newUsername }));
      }
    } catch (err) {
      setMessage('Lỗi kết nối máy chủ');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Mật khẩu mới không khớp');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/update-password/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await response.json();
      setMessage(data.msg);
      if (response.ok) {
        setShowPasswordModal(false);
      }
    } catch (err) {
      setMessage('Lỗi kết nối máy chủ');
    }
  };

  return (
    <div className="profile-modal">
      <div className="profile-content">
        <button className="profile-close" onClick={onClose}>×</button>
        <h2 className="profile-title">Thông tin tài khoản</h2>
        {userData ? (
          <>
            <div className="floating-label" style={{ marginBottom: '16px' }}>
              <input type="text" value={userData.email} disabled />
              <label>Email</label>
            </div>

            <div className="profile-info-row">
              <div className="floating-label">
                <input type="text" value={userData.username} disabled />
                <label>Tên người dùng</label>
              </div>
              <div className="floating-label">
                <input
                  type="text"
                  value={new Date(userData.created_at).toLocaleDateString()}
                  disabled
                />
                <label>Ngày tạo tài khoản</label>
              </div>
            </div>

            <div className="profile-buttons">
              <button className="jp-btn-main" onClick={() => setShowRenameModal(true)}>Đổi tên</button>
              <button className="jp-btn-main" onClick={() => setShowPasswordModal(true)}>Đổi mật khẩu</button>
            </div>
          </>
        ) : (
          <p>Đang tải...</p>
        )}
      </div>

      {showRenameModal && (
        <div className="fade-modal">
          <div className="fade-content">
            <button className="profile-close" onClick={() => setShowRenameModal(false)}>×</button>
            <h3>Đổi tên người dùng</h3>
            <input
              type="text"
              value={newUsername}
              placeholder="Tên mới"
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <button className="jp-btn-main" onClick={handleRename}>Xác nhận</button>
            {message && <p className="msg">{message}</p>}
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fade-modal">
          <div className="fade-content">
            <button className="profile-close" onClick={() => setShowPasswordModal(false)}>×</button>
            <h3>Đổi mật khẩu</h3>
            <input
              type="password"
              placeholder="Mật khẩu cũ"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className="jp-btn-main" onClick={handlePasswordChange}>Xác nhận</button>
            {message && <p className="msg">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
