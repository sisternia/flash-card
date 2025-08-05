import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Quiz.css';
import { getUserSets, getFlashcardsBySetId } from '../services/api';

const shuffle = arr => arr.map(v => [Math.random(), v]).sort(() => Math.random() - 0.5).map(([_, v]) => v);

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sets, setSets] = useState([]);
  const [selectedSetId, setSelectedSetId] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [options, setOptions] = useState([]);
  const [dragId, setDragId] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [result, setResult] = useState({ correct: 0, total: 0, finished: false });
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const decksPerPage = 4;

  // Bước 1: Lấy danh sách bộ thẻ
  useEffect(() => {
    const fetchSets = async () => {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const user_id = user?.id;
      if (!user_id) return;
      const data = await getUserSets(user_id);
      setSets(data);
    };
    fetchSets();
  }, []);

  // Bước 2: Khi chọn bộ thẻ, fetch từ vựng và bắt đầu game
  useEffect(() => {
    if (!selectedSetId) return;
    const fetchFlashcards = async () => {
      const data = await getFlashcardsBySetId(selectedSetId);
      setFlashcards(data);
      setPairs(data.map(card => ({ id: card.id, front: card.front, matched: false })));
      setOptions(shuffle(data.map(card => ({ id: card.id, back: card.back, dragging: false, matched: false }))));
      setResult({ correct: 0, total: data.length, finished: false });
      setTimeLeft(data.length * 2);
      setGameStarted(false);
    };
    fetchFlashcards();
  }, [selectedSetId]);

  // Bước 3: Khi bắt đầu game, chạy timer
  useEffect(() => {
    if (!gameStarted || result.finished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setResult(r => ({ ...r, finished: true }));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [gameStarted, result.finished]);

  const indexOfLastDeck = currentPage * decksPerPage;
  const indexOfFirstDeck = indexOfLastDeck - decksPerPage;
  const currentDecks = sets.slice(indexOfFirstDeck, indexOfLastDeck);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(sets.length / decksPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Xử lý kéo thả
  const handleDragStart = id => setDragId(id);
  const handleDragOver = id => setDropTarget(id);
  const handleDragLeave = () => setDropTarget(null);
  const handleDrop = (targetId) => {
    if (dragId === null) return;
    if (dragId === targetId) {
      setPairs(pairs => {
        const alreadyMatched = pairs.find(p => p.id === targetId)?.matched;
        const newPairs = pairs.map(p => p.id === targetId ? { ...p, matched: true } : p);
        const allMatched = newPairs.every(p => p.matched);
        setResult(r => {
          // Đếm số đúng dựa trên số cặp matched thực tế
          const correct = newPairs.filter(p => p.matched).length;
          if (allMatched) {
            clearInterval(timerRef.current);
            return { ...r, correct, finished: true };
          }
          return { ...r, correct };
        });
        return newPairs;
      });
      setOptions(opts => opts.map(o => o.id === dragId ? { ...o, matched: true } : o));
    } else {
      // Sai, hiệu ứng đỏ sẽ xử lý ở CSS
    }
    setDragId(null);
    setDropTarget(null);
  };

  // Thanh progress bar thời gian
  const renderProgressBar = () => (
    <div style={{ width: '100%', height: 16, background: '#e0e0e0', borderRadius: 8, marginBottom: 18 }}>
      <div style={{ width: `${Math.max(0, (timeLeft / (flashcards.length * 2)) * 100)}%`, height: '100%', background: '#2ecc40', borderRadius: 8, transition: 'width 0.5s' }} />
    </div>
  );

  // Bước chọn bộ thẻ
  if (!selectedSetId) {
    return (
      <div className="quiz-bg-jp">
        <div className="quiz-container-jp">
          <h2>Chọn bộ thẻ để bắt đầu ôn tập</h2>
          <div className="decks-container">
            {currentDecks.map(set => (
              <div key={set.id} className="flashcard-set-jp" onClick={() => setSelectedSetId(set.id)}>
                <h3>{set.title}</h3>
                <div>{set.description}</div>
              </div>
            ))}
          </div>
          <div className="pagination-jp">
            {pageNumbers.map(number => (
              <button key={number} onClick={() => paginate(number)} className={`page-number-jp ${currentPage === number ? 'current-page-jp' : ''}`}>
                {number}
              </button>
            ))}
            {totalPages > 1 && (
              <button onClick={() => paginate(totalPages)} className="last-page-jp">
                Last Page
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Bước chơi game
  return (
    <div className="quiz-bg-jp">
      <button
        style={{
          position: 'absolute',
          top: 70,
          left: 18,
          zIndex: 10,
          background: '#fff',
          border: '2px solid #e63946',
          borderRadius: 8,
          padding: '0.4rem 1.1rem',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
        onClick={() => setSelectedSetId(null)}
      >
        ← BACK
      </button>
      <div className="quiz-container-jp">
        <h2>Mini game kéo thả từ vựng</h2>
        {gameStarted ? (
          <>
            {renderProgressBar()}
            <div style={{ marginBottom: 12, color: '#3b4cca', fontWeight: 500 }}>Thời gian còn lại: {timeLeft}s</div>
            {result.finished ? (
              <div className="quiz-finish-jp">
                <h3>Bạn đã hoàn thành!</h3>
                <div>Đúng {result.correct} / {result.total} từ</div>
                <button className="jp-btn-main" onClick={() => window.location.reload()}>Chơi lại</button>
              </div>
            ) : (
              <div className="dragdrop-main">
                <div className="dragdrop-pairs">
                  {pairs.map(pair => !pair.matched && (
                    <div
                      key={pair.id}
                      className={`dragdrop-dropzone${dropTarget === pair.id && dragId !== null ? (dragId === pair.id ? ' correct' : ' wrong') : ''}`}
                      onDragOver={e => { e.preventDefault(); handleDragOver(pair.id); }}
                      onDragLeave={handleDragLeave}
                      onDrop={e => { e.preventDefault(); handleDrop(pair.id); }}
                    >
                      <span className="dragdrop-front">{pair.front}</span>
                      {dropTarget === pair.id && dragId === pair.id && <span className="dragdrop-tick">✔️</span>}
                      {dropTarget === pair.id && dragId !== null && dragId !== pair.id && <span className="dragdrop-cross">❌</span>}
                    </div>
                  ))}
                </div>
                <div className="dragdrop-options">
                  {options.map(opt => !opt.matched && (
                    <div
                      key={opt.id}
                      className="dragdrop-option"
                      draggable
                      onDragStart={() => handleDragStart(opt.id)}
                      onDragEnd={() => { setDragId(null); setDropTarget(null); }}
                    >
                      {opt.back}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button className="jp-btn-main" style={{ fontSize: 22, padding: '12px 36px' }} onClick={() => setGameStarted(true)}>Bắt đầu Mini Game</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz; 