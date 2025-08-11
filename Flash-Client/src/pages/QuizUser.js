import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuizUser.css';
import { getAllUsersWithSetCount } from '../services/api';

const QuizUser = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsersWithSetCount();
        // Lọc người dùng có set_count > 0 để chỉ hiển thị những người đã tạo flashcard
        const usersWithSets = data.filter(user => user.set_count > 0);
        setUsers(usersWithSets);
      } catch (err) {
        setError('Không thể tải danh sách người dùng.');
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  const handleViewDetails = (userId) => {
    navigate(`/quiz?user_id=${userId}`);
  };

  return (
    <div className="quiz-user-container">
      <h1>Danh sách người dùng đã tạo Flashcard</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="user-list">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <h3>{user.username}</h3>
                <p>Số bộ Flashcard: {user.set_count}</p>
              </div>
              <button
                className="jp-btn-main view-details-btn"
                onClick={() => handleViewDetails(user.id)}
              >
                Xem chi tiết
              </button>
            </div>
          ))
        ) : (
          <p>Không có người dùng nào đã tạo Flashcard.</p>
        )}
      </div>
    </div>
  );
};

export default QuizUser;