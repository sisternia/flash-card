import React, { useEffect, useState, useRef } from 'react';
import './FlashVoca.css';
import './Home.css';
import Modals from '../components/Modals';

const FlashVoca = ({ selectedSetId, setFlashcards, flashcards, setQuizFromVocabId, learnedStatus, setLearnedStatus }) => {
  const [showAddVocab, setShowAddVocab] = useState(false);
  const [addVocabSetId, setAddVocabSetId] = useState(null);
  const [vocabFront, setVocabFront] = useState('');
  const [vocabPhonetic, setVocabPhonetic] = useState('');
  const [vocabBack, setVocabBack] = useState('');
  const [vocabImage, setVocabImage] = useState(null);
  const [addVocabLoading, setAddVocabLoading] = useState(false);
  const [addVocabError, setAddVocabError] = useState('');
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);
  const [errorFlashcards, setErrorFlashcards] = useState('');
  const [currentVocabPage, setCurrentVocabPage] = useState(1);
  const [vocabsPerPage, setVocabsPerPage] = useState(3);
  const [vocabMenuOpenId, setVocabMenuOpenId] = useState(null);
  const [showEditVocab, setShowEditVocab] = useState(false);
  const [editVocabData, setEditVocabData] = useState(null);
  const [showDeleteVocab, setShowDeleteVocab] = useState(false);
  const [deleteVocabId, setDeleteVocabId] = useState(null);
  const [deleteVocabLoading, setDeleteVocabLoading] = useState(false);
  const [deleteVocabError, setDeleteVocabError] = useState('');
  const [editVocabLoading, setEditVocabLoading] = useState(false);
  const [editVocabError, setEditVocabError] = useState('');
  const [editVocabImage, setEditVocabImage] = useState(null);
  const [vocabImageUrl, setVocabImageUrl] = useState('');
  const [editVocabImageUrl, setEditVocabImageUrl] = useState('');
  const vocabListRef = useRef(null);

  useEffect(() => {
    const calculateVocabsPerPage = () => {
      if (vocabListRef.current) {
        const containerHeight = vocabListRef.current.clientHeight;
        const itemHeight = 150; // Approximate height of a vocab item
        const newVocabsPerPage = Math.floor(containerHeight / itemHeight);
        setVocabsPerPage(newVocabsPerPage > 0 ? newVocabsPerPage : 1);
      }
    };

    calculateVocabsPerPage();
    window.addEventListener('resize', calculateVocabsPerPage);

    return () => {
      window.removeEventListener('resize', calculateVocabsPerPage);
    };
  }, []);

  const indexOfLastVocab = currentVocabPage * vocabsPerPage;
  const indexOfFirstVocab = indexOfLastVocab - vocabsPerPage;
  const currentVocabs = flashcards.slice(indexOfFirstVocab, indexOfLastVocab);

  const paginateVocab = pageNumber => setCurrentVocabPage(pageNumber);

  const renderVocabPagination = () => {
    const pageCount = Math.ceil(flashcards.length / vocabsPerPage);
    if (pageCount <= 1) return null;

    const pages = [];
    for (let i = 1; i <= pageCount; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => paginateVocab(i)}
          className={currentVocabPage === i ? 'active' : ''}
        >
          {i}
        </button>
      );
    }
    return <div className="pagination vocab-pagination">{pages}</div>;
  };

  const handleShowAddVocab = (setId) => {
    setAddVocabSetId(setId);
    setShowAddVocab(true);
    setVocabFront('');
    setVocabPhonetic('');
    setVocabBack('');
    setVocabImage(null);
    setVocabImageUrl('');
    setAddVocabError('');
  };

  const handleAddVocab = async (e) => {
    e.preventDefault();
    if (!vocabFront.trim() || !vocabBack.trim()) {
      setAddVocabError('Vui lòng nhập đầy đủ từ vựng và ý nghĩa!');
      return;
    }
    setAddVocabLoading(true);
    setAddVocabError('');
    try {
      const formData = new FormData();
      formData.append('front', vocabFront);
      formData.append('phonetic', vocabPhonetic);
      formData.append('back', vocabBack);
      if (vocabImageUrl) formData.append('image_url', vocabImageUrl);
      if (vocabImage) formData.append('image', vocabImage);
      const res = await fetch(`http://localhost:5000/api/sets/${addVocabSetId}/flashcards`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Lỗi thêm từ vựng');
      setShowAddVocab(false);
      if (addVocabSetId === selectedSetId) {
        const res = await fetch(`http://localhost:5000/api/sets/${selectedSetId}/flashcards`);
        const data = await res.json();
        if (res.ok) {
          setFlashcards(data);
          setLearnedStatus(prev => {
            const newStatus = { ...prev };
            data.forEach(card => {
              if (!(card.id in newStatus)) {
                newStatus[card.id] = false;
              }
            });
            return newStatus;
          });
        }
      }
    } catch (err) {
      setAddVocabError(err.message);
    } finally {
      setAddVocabLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedSetId) return;
    const fetchFlashcards = async () => {
      setLoadingFlashcards(true);
      setErrorFlashcards('');
      try {
        const res = await fetch(`http://localhost:5000/api/sets/${selectedSetId}/flashcards`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Lỗi tải từ vựng');
        setFlashcards(data);
        setLearnedStatus(prev => {
          const newStatus = { ...prev };
          data.forEach(card => {
            if (!(card.id in newStatus)) {
              newStatus[card.id] = false;
            }
          });
          return newStatus;
        });
      } catch (err) {
        setErrorFlashcards(err.message);
      } finally {
        setLoadingFlashcards(false);
      }
    };
    fetchFlashcards();
  }, [selectedSetId, setFlashcards, setLearnedStatus]);

  const handleToggleLearned = (id) => {
    setLearnedStatus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleVocabClick = (card) => {
    if (learnedStatus[card.id]) {
      setQuizFromVocabId(card.id);
    }
  };

  const handleOpenVocabMenu = (id, e) => {
    e.stopPropagation();
    setVocabMenuOpenId(id === vocabMenuOpenId ? null : id);
  };

  const handleEditVocab = (card) => {
    setShowEditVocab(true);
    setEditVocabData(card);
    setEditVocabImage(null);
    setEditVocabImageUrl(card.image_url || '');
    setVocabMenuOpenId(null);
  };

  const handleDeleteVocab = (id) => {
    setShowDeleteVocab(true);
    setDeleteVocabId(id);
    setVocabMenuOpenId(null);
  };

  const confirmDeleteVocab = async () => {
    setDeleteVocabLoading(true);
    setDeleteVocabError('');
    try {
      await fetch(`http://localhost:5000/api/sets/${selectedSetId}/flashcards/${deleteVocabId}`, { method: 'DELETE' });
      setShowDeleteVocab(false);
      setDeleteVocabId(null);
      const res = await fetch(`http://localhost:5000/api/sets/${selectedSetId}/flashcards`);
      const data = await res.json();
      if (res.ok) {
        setFlashcards(data);
        setLearnedStatus(prev => {
          const newStatus = { ...prev };
          data.forEach(card => {
            if (!(card.id in newStatus)) {
              newStatus[card.id] = false;
            }
          });
          return newStatus;
        });
      }
    } catch (err) {
      setDeleteVocabError('Lỗi xóa từ vựng');
    } finally {
      setDeleteVocabLoading(false);
    }
  };

  const handleEditVocabSubmit = async (e) => {
    e.preventDefault();
    setEditVocabLoading(true);
    setEditVocabError('');
    try {
      const formData = new FormData();
      formData.append('front', editVocabData.front);
      formData.append('phonetic', editVocabData.phonetic || '');
      formData.append('back', editVocabData.back);
      if (editVocabImageUrl) formData.append('image_url', editVocabImageUrl);
      if (editVocabImage) formData.append('image', editVocabImage);
      const res = await fetch(`http://localhost:5000/api/sets/${selectedSetId}/flashcards/${editVocabData.id}`, {
        method: 'PUT',
        body: formData
      });
      if (!res.ok) throw new Error('Lỗi sửa từ vựng');
      setShowEditVocab(false);
      const res2 = await fetch(`http://localhost:5000/api/sets/${selectedSetId}/flashcards`);
      const data2 = await res2.json();
      if (res2.ok) {
        setFlashcards(data2);
        setLearnedStatus(prev => {
          const newStatus = { ...prev };
          data2.forEach(card => {
            if (!(card.id in newStatus)) {
              newStatus[card.id] = false;
            }
          });
          return newStatus;
        });
      }
    } catch (err) {
      setEditVocabError('Lỗi sửa từ vựng');
    } finally {
      setEditVocabLoading(false);
    }
  };

  const speak = (text, lang = 'ja-JP') => {
    if (!window.speechSynthesis) return;
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = lang;
    window.speechSynthesis.speak(utter);
  };

  return (
    <>
      <section className="dashboard-vocab dashboard-col">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ marginBottom: 0 }}>Từ vựng trong bộ thẻ</h2>
          {selectedSetId && (
            <button
              className="add-vocab-btn"
              title="Thêm từ vựng"
              style={{ background: '#2ecc40', color: '#fff', border: 'none', borderRadius: '50%', width: 48, height: 48, fontSize: 32, fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 8px #2ecc4022', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => handleShowAddVocab(selectedSetId)}
            >
              +
            </button>
          )}
        </div>
        <div className="vocab-list" ref={vocabListRef}>
          {loadingFlashcards ? (
            <div style={{ color: '#888' }}>Đang tải từ vựng...</div>
          ) : errorFlashcards ? (
            <div style={{ color: '#e63946' }}>{errorFlashcards}</div>
          ) : flashcards.length === 0 ? (
            <div style={{ color: '#888' }}>Chưa có từ vựng nào trong bộ này.</div>
          ) : (
            currentVocabs.map(card => (
              <div className="vocab-item" key={card.id} onClick={() => handleVocabClick(card)} style={{ cursor: learnedStatus[card.id] ? 'pointer' : 'default', position: 'relative' }}>
                <button className="vocab-menu-btn" style={{ position: 'absolute', top: 8, left: 8, background: 'none', border: 'none', cursor: 'pointer', zIndex: 2 }} onClick={e => handleOpenVocabMenu(card.id, e)}>
                  <span style={{ fontSize: 22, color: '#3b4cca', fontWeight: 'bold', letterSpacing: 1 }}>&#8942;</span>
                </button>
                {vocabMenuOpenId === card.id && (
                  <div className="vocab-menu" style={{ position: 'absolute', top: 36, left: 8, background: '#fff', border: '1px solid #eee', borderRadius: 8, boxShadow: '0 4px 16px #3b4cca33', zIndex: 10, minWidth: 140 }} onClick={e => e.stopPropagation()}>
                    <button className="vocab-menu-option" style={{ color: '#3b4cca' }} onClick={() => handleEditVocab(card)}>Sửa thông tin từ vựng</button>
                    <button className="vocab-menu-option" style={{ color: '#e63946' }} onClick={() => handleDeleteVocab(card.id)}>Xóa từ vựng</button>
                  </div>
                )}
                <div className="vocab-main">
                  <div className="vocab-header-row">
                    <button className="vocab-audio-btn" title="Phát âm" onClick={e => { e.stopPropagation(); speak(card.phonetic || card.front, 'ja-JP'); }}>
                      <span role="img" aria-label="audio">🔊</span>
                    </button>
                    <span className="vocab-word">{card.front}</span>
                  </div>
                  {card.phonetic && <span className="vocab-phonetic">{card.phonetic}</span>}
                  <div className="vocab-note">{card.back}</div>
                </div>
                <div className="vocab-status-controls">
                  <span className={`vocab-status${learnedStatus[card.id] ? ' learned' : ''}`}>{learnedStatus[card.id] ? 'Đã thuộc' : 'Chưa thuộc'}</span>
                  <input type="checkbox" checked={!!learnedStatus[card.id]} onChange={e => { e.stopPropagation(); handleToggleLearned(card.id); }} style={{ accentColor: '#2ecc40', width: 18, height: 18 }} />
                </div>
                {(card.image_url) && (
                  (card.image_url && card.image_url.startsWith('http')) ? (
                    <img className="vocab-img" src={card.image_url} alt="minh họa" />
                  ) : card.image_url ? (
                    <img className="vocab-img" src={`http://localhost:5000${card.image_url}`} alt="minh họa" />
                  ) : null
                )}
              </div>
            ))
          )}
        </div>
        {renderVocabPagination()}
      </section>
      <Modals
        showAddVocab={showAddVocab}
        setShowAddVocab={setShowAddVocab}
        vocabFront={vocabFront}
        setVocabFront={setVocabFront}
        vocabPhonetic={vocabPhonetic}
        setVocabPhonetic={setVocabPhonetic}
        vocabBack={vocabBack}
        setVocabBack={setVocabBack}
        vocabImage={vocabImage}
        setVocabImage={setVocabImage}
        vocabImageUrl={vocabImageUrl}
        setVocabImageUrl={setVocabImageUrl}
        addVocabLoading={addVocabLoading}
        addVocabError={addVocabError}
        handleAddVocab={handleAddVocab}
        showEditVocab={showEditVocab}
        setShowEditVocab={setShowEditVocab}
        editVocabData={editVocabData}
        setEditVocabData={setEditVocabData}
        editVocabImage={editVocabImage}
        setEditVocabImage={setEditVocabImage}
        editVocabImageUrl={editVocabImageUrl}
        setEditVocabImageUrl={setEditVocabImageUrl}
        editVocabLoading={editVocabLoading}
        editVocabError={editVocabError}
        handleEditVocabSubmit={handleEditVocabSubmit}
        showDeleteVocab={showDeleteVocab}
        setShowDeleteVocab={setShowDeleteVocab}
        deleteVocabLoading={deleteVocabLoading}
        deleteVocabError={deleteVocabError}
        confirmDeleteVocab={confirmDeleteVocab}
      />
    </>
  );
};

export default FlashVoca;