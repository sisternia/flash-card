import React, { useEffect, useState } from 'react';
import './Profile.css';
import {
  getUserProfile,
  updateUsername,
  updatePassword
} from '../services/api';

const Profile = ({ user, onClose, onUpdateUser }) => {
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
        const data = await getUserProfile(user.id);
        setUserData(data);
        onUpdateUser({ ...user, username: data.username }); // Sync parent state with latest data
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchUserInfo();
  }, [user.id, onUpdateUser]);  

  const handleRename = async () => {
    try {
      const data = await updateUsername(user.id, newUsername);
      setMessage(data.msg);
      if (data.msg?.toLowerCase().includes('thành công')) {
        setShowRenameModal(false);
        const updatedUser = { ...user, username: newUsername };
        setUserData(prev => ({ ...prev, username: newUsername }));
        onUpdateUser(updatedUser); // Update parent state
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Update localStorage
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
      const data = await updatePassword(user.id, oldPassword, newPassword);
      setMessage(data.msg);
      if (data.msg?.toLowerCase().includes('thành công')) {
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