import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './Home.css';
import FlashMana from './FlashMana';
import FlashVoca from './FlashVoca';
import FlashQuiz from './FlashQuiz';

const Dashboard = () => {
  const [selectedSetId, setSelectedSetId] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnedStatus, setLearnedStatus] = useState({});
  const [quizFromVocabId, setQuizFromVocabId] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const user_id = user?.id;

  return (
    <div className="dashboard-3col-container">
      <FlashMana
        user_id={user_id}
        navigate={navigate}
        selectedSetId={selectedSetId}
        setSelectedSetId={setSelectedSetId}
      />
      <FlashVoca
        selectedSetId={selectedSetId}
        setFlashcards={setFlashcards}
        flashcards={flashcards}
        setQuizFromVocabId={setQuizFromVocabId}
        learnedStatus={learnedStatus}
        setLearnedStatus={setLearnedStatus}
      />
      <FlashQuiz
        flashcards={flashcards}
        learnedStatus={learnedStatus}
        quizFromVocabId={quizFromVocabId}
        quizIndex={quizIndex}
        isFlipped={isFlipped}
        setQuizIndex={setQuizIndex}
        setIsFlipped={setIsFlipped}
        setQuizFromVocabId={setQuizFromVocabId}
      />
    </div>
  );
};

export default Dashboard;