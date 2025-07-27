import React from 'react';
import mascot from '../assets/mascot.png'; // Added import for mascot image
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-bg-jp mascot-bg-jp">
      <div className="mascot-overlay">
        <img src={mascot} alt="Mascot background" />
      </div>
      <header className="landing-header-jp">
        <div className="brand-logo-jp">
          <span role="img" aria-label="sakura">🌸</span> NihonCard
        </div>
        <a href="/login" className="landing-btn-go">Go to lessons</a>
      </header>
      <div className="landing-content-jp">
        <div className="landing-left-jp">
          <h1>Japanese Alphabets for beginner</h1>
          <p className="landing-desc-jp">Let's learn Japanese together!</p>
          <div className="landing-btn-group-jp">
            <a href="/register" className="landing-btn-main">Start learn Hiragana</a>
            <a href="/register" className="landing-btn-sub">Learn Kanji</a>
          </div>
        </div>
        {/* Xóa mascot nhỏ bên phải */}
      </div>
    </div>
  );
};

export default Landing; 