import React, { useEffect } from 'react';
import './FlashQuiz.css';
import './Home.css';

const FlashQuiz = ({ flashcards, learnedStatus, quizFromVocabId, quizIndex, isFlipped, setQuizIndex, setIsFlipped, setQuizFromVocabId }) => {
  const quizFlashcards = quizFromVocabId
    ? flashcards.filter(card => card.id === quizFromVocabId)
    : flashcards.filter(card => !learnedStatus[card.id]);

  const handleQuizNext = () => {
    if (quizFromVocabId) {
      setQuizFromVocabId(null);
      setQuizIndex(0);
      setIsFlipped(false);
    } else {
      setQuizIndex(i => (i + 1) % quizFlashcards.length);
      setIsFlipped(false);
    }
  };

  const handleQuizPrev = () => {
    if (quizFromVocabId) {
      setQuizFromVocabId(null);
      setQuizIndex(0);
      setIsFlipped(false);
    } else {
      setQuizIndex(i => (i - 1 + quizFlashcards.length) % quizFlashcards.length);
      setIsFlipped(false);
    }
  };

  useEffect(() => {
    setQuizIndex(0);
    setIsFlipped(false);
  }, [quizFromVocabId, flashcards, setQuizIndex, setIsFlipped]);

  return (
    <section className="dashboard-quiz dashboard-col">
      <h2 style={{ marginBottom: 16 }}>Quiz Flashcard</h2>
      {quizFlashcards.length === 0 ? (
        <div style={{ color: '#888', marginTop: 32 }}>Chưa có từ vựng để ôn tập.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 0 }}>
          <div className={`quiz-flashcard${isFlipped ? ' flipped' : ''}`} style={{ marginTop: 0, minHeight: 240 }} onClick={() => setIsFlipped(f => !f)}>
            <div className="quiz-flashcard-inner" style={{ zIndex: 2 }}>
              <div className="quiz-front" style={{ marginBottom: 6 }}>{quizFlashcards[quizIndex].front}</div>
              {quizFlashcards[quizIndex].phonetic && <div className="quiz-phonetic">{quizFlashcards[quizIndex].phonetic}</div>}
              {quizFromVocabId && learnedStatus[quizFlashcards[quizIndex].id] && (
                <div style={{ color: '#2ecc40', fontSize: 13, fontStyle: 'italic', marginTop: 2 }}>Đã thuộc</div>
              )}
              {(quizFlashcards[quizIndex].image_url && quizFlashcards[quizIndex].image_url.startsWith('http')) ? (
                <img src={quizFlashcards[quizIndex].image_url} alt="minh họa" style={{ height: 140, marginTop: 10, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #0002' }} />
              ) : quizFlashcards[quizIndex].image_url ? (
                <img src={`http://localhost:5000${quizFlashcards[quizIndex].image_url}`} alt="minh họa" style={{ height: 140, marginTop: 10, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #0002' }} />
              ) : null}
            </div>
            <div className="quiz-flashcard-inner quiz-flashcard-back" style={{ zIndex: 1 }}>
              <div className="quiz-back">{quizFlashcards[quizIndex].back}</div>
            </div>
          </div>
          <div className="quiz-controls">
            <button onClick={handleQuizPrev}>&lt; Trước</button>
            <button onClick={handleQuizNext}>Tiếp &gt;</button>
          </div>
          <div style={{ marginTop: 8, fontSize: 13, color: '#888' }}>Bấm vào thẻ để lật</div>
        </div>
      )}
    </section>
  );
};

export default FlashQuiz;