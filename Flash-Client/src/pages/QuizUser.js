
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuizUser.css';
import { getAllUsers } from '../services/api';

const QuizUser = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleViewDetails = (userId) => {
    navigate('/quiz', { state: { userId } });
  };

  return (
    <div className="quiz-user-bg">
      <button
        style={{ position: 'absolute', top: 70, left: 18, zIndex: 10, background: '#fff', border: '2px solid #e63946', borderRadius: 8, padding: '0.4rem 1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
        onClick={() => navigate(-1)}
      >
        ← BACK
      </button>
      <div className="quiz-user-container">
        <h2>User List</h2>
        <div className="user-cards-container">
          {users.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <div className="username">{user.username}</div>
                <div className="email">{user.email}</div>
              </div>
              <div className="flashcard-count">
                <span className="label">Flashcards: {user.flashcard_set_count}</span>
              </div>
              <button className="view-details-btn" onClick={() => handleViewDetails(user.id)}>View Details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizUser;
