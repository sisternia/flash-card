import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Quiz.css';

const Quiz = () => {
  const navigate = useNavigate();
  // Dữ liệu mẫu
  const question = {
    front: '家族',
    options: ['Gia đình', 'Bạn bè', 'Trường học', 'Công việc'],
    answer: 0,
  };

  return (
    <div className="quiz-bg-jp">
      <button
        style={{ position: 'absolute', top: 70, left: 18, zIndex: 10, background: '#fff', border: '2px solid #e63946', borderRadius: 8, padding: '0.4rem 1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
        onClick={() => navigate(-1)}
      >
        ← BACK
      </button>
      <div className="quiz-container-jp">
        <h2>Ôn tập từ vựng</h2>
        <div className="quiz-card-jp">
          <div className="quiz-question-jp">{question.front}</div>
          <div className="quiz-options-jp">
            {question.options.map((opt, idx) => (
              <button className="quiz-option-btn-jp" key={idx}>{opt}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz; 