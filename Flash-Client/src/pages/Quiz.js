import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Quiz.css';

const shuffle = arr => arr.map(v => [Math.random(), v]).sort(() => Math.random() - 0.5).map(([_, v]) => v);

const PAIRS_PER_ROUND = 6; // 3 pairs per column

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sets, setSets] = useState([]);
  const [selectedSetId, setSelectedSetId] = useState(null);
  const [flashcards, setFlashcards] = useState([]); // Master list of all flashcards
  const [pairs, setPairs] = useState([]); // Pairs for the current round
  const [options, setOptions] = useState([]); // Options for the current round
  const [dragId, setDragId] = useState(null);
  const [dropResult, setDropResult] = useState({});
  const [result, setResult] = useState({ correct: 0, total: 0, finished: false });
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRound, setCurrentRound] = useState(0);
  const decksPerPage = 4;

  // Fetch sets
  useEffect(() => {
    const fetchSets = async () => {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (!user?.id) return;
      const res = await fetch(`http://localhost:5000/api/sets?user_id=${user.id}`);
      const data = await res.json();
      setSets(data);
    };
    fetchSets();
  }, []);

  const setupRound = (roundIndex, allFlashcards) => {
    const start = roundIndex * PAIRS_PER_ROUND;
    const end = start + PAIRS_PER_ROUND;
    const roundFlashcards = allFlashcards.slice(start, end);

    setPairs(roundFlashcards.map(card => ({ id: card.id, front: card.front, matched: false })));
    setOptions(shuffle(roundFlashcards.map(card => ({ id: card.id, back: card.back, matched: false }))));
  };

  // Fetch flashcards and setup first round
  useEffect(() => {
    if (!selectedSetId) return;
    const fetchFlashcards = async () => {
      const res = await fetch(`http://localhost:5000/api/sets/${selectedSetId}/flashcards`);
      const data = await res.json();
      setFlashcards(data);
      setResult({ correct: 0, total: data.length, finished: false });
      setTimeLeft(data.length * 5); // 5 seconds per word for the whole game
      setGameStarted(false);
      setCurrentRound(0);
      setupRound(0, data);
    };
    fetchFlashcards();
  }, [selectedSetId]);

  // Timer logic
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

  const playCorrectSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  // Drag and drop handlers
  const handleDragStart = id => setDragId(id);

  const handleDrop = (targetId) => {
    if (dragId === null) return;

    const targetPair = pairs.find(p => p.id === targetId);
    if (!targetPair || targetPair.matched) {
      setDragId(null);
      return; // Already matched, do nothing.
    }

    const isCorrect = dragId === targetId;

    if (isCorrect) {
      playCorrectSound();
      setDropResult({ ...dropResult, [targetId]: 'disappearing' });

      setTimeout(() => {
        setOptions(currentOpts => currentOpts.map(o => (o.id === dragId ? { ...o, matched: true } : o)));
        setPairs(currentPairs => {
          const newPairs = currentPairs.map(p => (p.id === targetId ? { ...p, matched: true } : p));
          
          const roundCorrectCount = newPairs.filter(p => p.matched).length;
          const totalCorrectCount = (currentRound * PAIRS_PER_ROUND) + roundCorrectCount;
          
          // Check if round is complete
          if (roundCorrectCount === pairs.length) {
            const nextRound = currentRound + 1;
            if (nextRound * PAIRS_PER_ROUND < flashcards.length) {
              // Move to next round
              setTimeout(() => {
                setCurrentRound(nextRound);
                setupRound(nextRound, flashcards);
                setDropResult({});
              }, 1000);
            } else {
              // Game finished
              clearInterval(timerRef.current);
              setResult({ correct: totalCorrectCount, total: flashcards.length, finished: true });
            }
          } else {
            setResult(r => ({ ...r, correct: totalCorrectCount }));
          }
          return newPairs;
        });
      }, 600); // Wait for animation to finish

    } else {
      setDropResult({ ...dropResult, [targetId]: 'wrong' });
      setTimeout(() => {
        setDropResult(res => {
          const newRes = { ...res };
          delete newRes[targetId];
          return newRes;
        });
      }, 800);
    }
    
    setDragId(null);
  };

  // Progress bar
  const renderProgressBar = () => (
    <div style={{ width: '100%', height: 16, background: '#e0e0e0', borderRadius: 8, marginBottom: 18 }}>
      <div style={{
        width: `${Math.max(0, (timeLeft / (flashcards.length * 5)) * 100)}%`,
        height: '100%',
        background: '#2ecc40',
        borderRadius: 8,
        transition: 'width 0.5s'
      }} />
    </div>
  );

  // Bước chọn bộ thẻ
  if (!selectedSetId) {
    return (
      <div className="quiz-bg-jp">
        <button
          style={{ position: 'absolute', top: 70, left: 18, zIndex: 10, background: '#fff', border: '2px solid #e63946', borderRadius: 8, padding: '0.4rem 1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate(-1)}
        >
          ← BACK
        </button>
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
        style={{ position: 'absolute', top: 70, left: 18, zIndex: 10, background: '#fff', border: '2px solid #e63946', borderRadius: 8, padding: '0.4rem 1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
        onClick={() => navigate(-1)}
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
                  {pairs.map(pair => (
                    <div
                      key={pair.id}
                      className={`dragdrop-dropzone ${pair.matched ? 'matched' : ''} ${dropResult[pair.id] || ''}`}
                      onDragOver={e => { e.preventDefault(); }}
                      onDrop={e => { e.preventDefault(); handleDrop(pair.id); }}
                    >
                      <span className="dragdrop-front">{pair.front}</span>
                      {pair.matched && <span className="dragdrop-tick">✔️</span>}
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
                      onDragEnd={() => setDragId(null)}
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