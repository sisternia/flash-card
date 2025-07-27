import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const mascot = require('../assets/mascot.png');

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home-quizlet-bg">
      <div className="home-quizlet-container">
        <div className="home-quizlet-left">
          <h1 className="home-quizlet-title">Trở thành phiên bản xuất sắc nhất của chính bạn</h1>
          <p className="home-quizlet-desc">Học tiếng Nhật mọi lúc, mọi nơi, cùng Nihongo Flashcard!</p>
          <button className="home-quizlet-btn" onClick={() => navigate('/dashboard')}>Bắt đầu học</button>
          <div className="home-quizlet-info">
            <span>🌸 1000+ từ vựng JLPT</span>
            <span>📝 Ghi chú, hình ảnh, phát âm</span>
            <span>🏆 Theo dõi tiến trình học tập</span>
          </div>
        </div>
        <div className="home-quizlet-right">
          <img src={mascot} alt="Mascot" className="home-quizlet-img" />
          <div className="home-quizlet-img-desc">Khám phá thế giới tiếng Nhật cùng mascot dễ thương!</div>
        </div>
      </div>
    </div>
  );
};

export default Home; 