import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserSets, getFlashcardsBySetId } from '../services/api';
import './Quiz.css';

const shuffle = arr => arr.map(v => [Math.random(), v]).sort(() => Math.random() - 0.5).map(([_, v]) => v);

const PAIRS_PER_ROUND = 6;

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sets, setSets] = useState([]);
  const [selectedSetId, setSelectedSetId] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [options, setOptions] = useState([]);
  const [dragId, setDragId] = useState(null);
  const [dropResult, setDropResult] = useState({});
  const [result, setResult] = useState({ correct: 0, total: 0, finished: false });
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState(null);
  const timerRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRound, setCurrentRound] = useState(0);
  const [incorrectCards, setIncorrectCards] = useState([]);
  const [incorrectPage, setIncorrectPage] = useState(1);
  const [showReviewConfirm, setShowReviewConfirm] = useState(false);
  const [showEmptySetMessage, setShowEmptySetMessage] = useState(false);
  const decksPerPage = 4;
  const incorrectPerPage = 5;

  useEffect(() => {
    const fetchSets = async () => {
      // Lấy user_id từ query parameter hoặc từ localStorage
      const params = new URLSearchParams(location.search);
      const targetUserId = params.get('user_id');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const userId = targetUserId || user?.id;

      if (!userId) {
        setError('Không tìm thấy thông tin người dùng.');
        return;
      }

      try {
        const data = await getUserSets(userId);
        if (!data || data.length === 0) {
          setError('Người dùng này chưa tạo bộ flashcard nào.');
        } else {
          setSets(data);
          setError(null);
        }
      } catch (error) {
        setError('Lỗi tải danh sách bộ thẻ.');
        console.error('Error fetching sets:', error);
      }
    };
    fetchSets();
  }, [location.search]);

  const setupRound = (roundIndex, allFlashcards) => {
    const start = roundIndex * PAIRS_PER_ROUND;
    const end = start + PAIRS_PER_ROUND;
    const roundFlashcards = allFlashcards.slice(start, end);

    setPairs(roundFlashcards.map(card => ({ id: card.id, front: card.front, matched: false })));
    setOptions(shuffle(roundFlashcards.map(card => ({ id: card.id, back: card.back, matched: false }))));
  };

  useEffect(() => {
    if (!selectedSetId || selectedSetId === 'review') return;
    const fetchFlashcards = async () => {
      try {
        const data = await getFlashcardsBySetId(selectedSetId);
        if (data.length === 0) {
          setShowEmptySetMessage(true);
          setSelectedSetId(null);
          return;
        }
        setFlashcards(data);
        setResult({ correct: 0, total: data.length, finished: false });
        setTimeLeft(data.length * 5);
        setGameStarted(false);
        setCurrentRound(0);
        setIncorrectCards([]);
        setupRound(0, data);
      } catch (error) {
        setError('Lỗi tải flashcards.');
        console.error('Error fetching flashcards:', error);
      }
    };
    fetchFlashcards();
  }, [selectedSetId]);

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

  const playSound = (type) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

    if (type === 'correct') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.2);
    } else {
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.2);
    }

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const handleDragStart = id => setDragId(id);

  const handleDrop = (targetId) => {
    if (dragId === null) return;

    const targetPair = pairs.find(p => p.id === targetId);
    if (!targetPair || targetPair.matched) {
      setDragId(null);
      return;
    }

    const isCorrect = dragId === targetId;

    if (isCorrect) {
      playSound('correct');
      setDropResult({ ...dropResult, [targetId]: 'disappearing' });
      setResult(r => ({ ...r, correct: r.correct + 1 }));

      setTimeout(() => {
        setOptions(currentOpts => currentOpts.map(o => (o.id === dragId ? { ...o, matched: true } : o)));
        setPairs(currentPairs => {
          const newPairs = currentPairs.map(p => (p.id === targetId ? { ...p, matched: true } : p));
          if (newPairs.every(p => p.matched)) {
            const nextRound = currentRound + 1;
            if (nextRound * PAIRS_PER_ROUND < flashcards.length) {
              setTimeout(() => {
                setCurrentRound(nextRound);
                setupRound(nextRound, flashcards);
                setDropResult({});
              }, 1000);
            } else {
              clearInterval(timerRef.current);
              setResult(r => ({ ...r, finished: true }));
            }
          }
          return newPairs;
        });
      }, 600);
    } else {
      playSound('wrong');
      setDropResult({ ...dropResult, [targetId]: 'wrong' });
      const incorrectFlashcard = flashcards.find(f => f.id === targetId);
      if (incorrectFlashcard && !incorrectCards.find(c => c.id === targetId)) {
        setIncorrectCards(prev => [...prev, incorrectFlashcard]);
      }

      setTimeout(() => {
        setPairs(ps => ps.map(p => p.id === targetId ? { ...p, matched: true } : p));
        setOptions(os => os.map(o => o.id === dragId ? { ...o, matched: true } : o));
        setDropResult({});

        const allMatched = pairs.map(p => p.id === targetId ? { ...p, matched: true } : p).every(p => p.matched);
        if (allMatched) {
          const nextRound = currentRound + 1;
          if (nextRound * PAIRS_PER_ROUND < flashcards.length) {
            setTimeout(() => {
              setCurrentRound(nextRound);
              setupRound(nextRound, flashcards);
            }, 1000);
          } else {
            clearInterval(timerRef.current);
            setResult(r => ({ ...r, finished: true }));
          }
        }
      }, 800);
    }

    setDragId(null);
  };

  const handleReviewConfirm = (confirm) => {
    setShowReviewConfirm(false);
    if (confirm) {
      setFlashcards(incorrectCards);
      setResult({ correct: 0, total: incorrectCards.length, finished: false });
      setTimeLeft(incorrectCards.length * 5);
      setGameStarted(false);
      setCurrentRound(0);
      setIncorrectCards([]);
      setupRound(0, incorrectCards);
      setSelectedSetId('review');
    } else {
      setSelectedSetId(null);
      setFlashcards([]);
      setIncorrectCards([]);
      setResult({ correct: 0, total: 0, finished: false });
      setGameStarted(false);
    }
  };

  const handleExit = () => {
    setSelectedSetId(null);
    setFlashcards([]);
    setIncorrectCards([]);
    setResult({ correct: 0, total: 0, finished: false });
    setGameStarted(false);
  };

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

  const indexOfLastIncorrect = incorrectPage * incorrectPerPage;
  const indexOfFirstIncorrect = indexOfLastIncorrect - incorrectPerPage;
  const currentIncorrectCards = incorrectCards.slice(indexOfFirstIncorrect, indexOfLastIncorrect);
  const totalIncorrectPages = Math.ceil(incorrectCards.length / incorrectPerPage);

  if (!selectedSetId) {
    return (
      <div className="quiz-bg-jp">
        {showEmptySetMessage && (
          <div className="confirm-modal-overlay">
            <div className="confirm-modal">
              <p>Bộ thẻ này không có từ vựng để ôn tập.</p>
              <div className="confirm-modal-buttons">
                <button onClick={() => setShowEmptySetMessage(false)}>OK</button>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="confirm-modal-overlay">
            <div className="confirm-modal">
              <p>{error}</p>
              <div className="confirm-modal-buttons">
                <button onClick={() => navigate('/quiz-user')}>Quay lại</button>
              </div>
            </div>
          </div>
        )}
        <button
          style={{ position: 'absolute', top: 70, left: 18, zIndex: 10, background: '#fff', border: '2px solid #e63946', borderRadius: 8, padding: '0.4rem 1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/quiz-user')}
        >
          ← BACK
        </button>
        <div className="quiz-container-jp">
          <h2>Chọn bộ thẻ để bắt đầu ôn tập</h2>
          <div className="decks-container">
            {sets.length > 0 ? (
              currentDecks.map(set => (
                <div key={set.id} className="flashcard-set-jp" onClick={() => setSelectedSetId(set.id)}>
                  <h3>{set.title}</h3>
                  <div>{set.description}</div>
                </div>
              ))
            ) : (
              <p>Không có bộ thẻ nào để hiển thị.</p>
            )}
          </div>
          {sets.length > 0 && (
            <div className="pagination-jp">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button key={number} onClick={() => paginate(number)} className={`page-number-jp ${currentPage === number ? 'current-page-jp' : ''}`}>{number}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-bg-jp">
      {showReviewConfirm && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <p>Bạn có muốn ôn tập lại những từ đã sai ở game trước đó không?</p>
            <div className="confirm-modal-buttons">
              <button onClick={() => handleReviewConfirm(true)}>Yes</button>
              <button onClick={() => handleReviewConfirm(false)}>No</button>
            </div>
          </div>
        </div>
      )}
      <button
        style={{ position: 'absolute', top: 70, left: 18, zIndex: 10, background: '#fff', border: '2px solid #e63946', borderRadius: 8, padding: '0.4rem 1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
        onClick={() => navigate('/quiz-user')}
      >
        ← BACK
      </button>
      <div className="quiz-container-jp game-frame">
        <h2>Mini game kéo thả từ vựng</h2>
        {gameStarted ? (
          <>
            {renderProgressBar()}
            <div style={{ marginBottom: 12, color: '#3b4cca', fontWeight: 500 }}>Thời gian còn lại: {timeLeft}s</div>
            {result.finished ? (
              <div className="quiz-finish-jp">
                <h3>Bạn đã hoàn thành!</h3>
                <div>Đúng {result.correct} / {result.total} từ</div>
                {incorrectCards.length > 0 && (
                  <div className="incorrect-words-container">
                    <h4>Các từ bạn đã sai:</h4>
                    <ul>
                      {currentIncorrectCards.map(card => (
                        <li key={card.id}>{card.front} - {card.back}</li>
                      ))}
                    </ul>
                    <div className="pagination-jp">
                      {Array.from({ length: totalIncorrectPages }, (_, i) => i + 1).map(number => (
                        <button key={number} onClick={() => setIncorrectPage(number)} className={`page-number-jp ${incorrectPage === number ? 'current-page-jp' : ''}`}>{number}</button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="finish-buttons">
                  {incorrectCards.length > 0 && 
                    <button className="jp-btn-main review-btn" onClick={() => setShowReviewConfirm(true)}>Ôn tập lại từ sai</button>
                  }
                  <button className="jp-btn-main" onClick={() => setSelectedSetId(null)}>Chọn bộ thẻ khác</button>
                  <button className="jp-btn-main exit-btn" onClick={handleExit}>Thoát</button>
                </div>
              </div>
            ) : (
              <div className="dragdrop-main">
                <div className="dragdrop-pairs">
                  {pairs.map(pair => !pair.matched && (
                    <div
                      key={pair.id}
                      className={`dragdrop-dropzone ${dropResult[pair.id] || ''}`}
                      onDragOver={e => { e.preventDefault(); }}
                      onDrop={e => { e.preventDefault(); handleDrop(pair.id); }}
                    >
                      <span className="dragdrop-front">{pair.front}</span>
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