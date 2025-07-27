import React from 'react';
import './SetDetail.css';

const SetDetail = () => {
  // Dữ liệu mẫu
  const words = [
    { id: 1, front: '家族', back: 'Gia đình', is_learned: false },
    { id: 2, front: '友達', back: 'Bạn bè', is_learned: true },
  ];

  return (
    <div className="setdetail-bg-jp">
      <div className="setdetail-header-jp">
        <h2>Chủ đề: Gia đình</h2>
        <button className="jp-btn-main">+ Thêm từ mới</button>
      </div>
      <div className="word-list-jp">
        {words.map(word => (
          <div className={`word-card-jp${word.is_learned ? ' learned' : ''}`} key={word.id}>
            <div className="word-front">{word.front}</div>
            <div className="word-back">{word.back}</div>
            <button className="jp-btn-learned">
              {word.is_learned ? 'Đã thuộc' : 'Đánh dấu đã thuộc'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetDetail; 