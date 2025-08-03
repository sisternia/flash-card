import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './Home.css'; // Giữ style Nhật nếu muốn

const Dashboard = () => {
  const [sets, setSets] = useState([]);
  const [selectedSetId, setSelectedSetId] = useState(null);
  const [showAddSet, setShowAddSet] = useState(false);
  const [newSetTitle, setNewSetTitle] = useState('');
  const [newSetDesc, setNewSetDesc] = useState('');
  const [menuOpenId, setMenuOpenId] = useState(null); // id của bộ đang mở menu 3 chấm
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [errorAdd, setErrorAdd] = useState('');
  const [loadingSets, setLoadingSets] = useState(true);
  const [errorSets, setErrorSets] = useState('');
  const navigate = useNavigate();

  // page next flashcard set//
  const [currentPage, setCurrentPage] = useState(1);
  const [setsPerPage] = useState(2);

  const indexOfLastSet = currentPage * setsPerPage;
  const indexOfFirstSet = indexOfLastSet - setsPerPage;
  const currentSets = sets.slice(indexOfFirstSet, indexOfLastSet);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pageCount = Math.ceil(sets.length / setsPerPage);
    if (pageCount <= 1) return null;
  
    const pages = [];
    
    // Logic for displaying pages
    if (pageCount <= 3) {
      // If 3 or fewer pages, show all
      for (let i = 1; i <= pageCount; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => paginate(i)}
            className={currentPage === i ? 'active' : ''}
          >
            {i}
          </button>
        );
      }
    } else {
      // More than 3 pages
      if (currentPage > 1) {
        pages.push(
          <button key="prev" className="prev-page" onClick={() => paginate(currentPage - 1)}>
            Prev
          </button>
        );
      }
  
      let startPage;
      if (currentPage === 1) {
        startPage = 1;
      } else if (currentPage === pageCount) {
        startPage = pageCount - 2;
      } else {
        startPage = currentPage -1;
      }
  
      for (let i = 0; i < 3; i++) {
        if (startPage + i <= pageCount) {
          pages.push(
            <button
              key={startPage + i}
              onClick={() => paginate(startPage + i)}
              className={currentPage === startPage + i ? 'active' : ''}
            >
              {startPage + i}
            </button>
          );
        }
        
      }
  
      if (currentPage < pageCount) {
        pages.push(
          <button key="last" className="last-page" onClick={() => paginate(pageCount)}>
            Last
          </button>
        );
      }
    }
  
    return <>{pages}</>;
  };


  // Lấy user_id từ localStorage
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const user_id = user?.id;

  // Fetch danh sách bộ flashcard từ backend khi load trang
  useEffect(() => {
    const fetchSets = async () => {
      setLoadingSets(true);
      setErrorSets('');
      try {
        const res = await fetch(`http://localhost:5000/api/sets?user_id=${user_id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Lỗi tải danh sách bộ flashcard');
        setSets(data);
        setSelectedSetId(data[0]?.id || null);
      } catch (err) {
        setErrorSets(err.message);
      } finally {
        setLoadingSets(false);
      }
    };
    if (user_id) fetchSets();
  }, [user_id]);

  const handleAddSet = async () => {
    if (!newSetTitle.trim()) return;
    setLoadingAdd(true);
    setErrorAdd('');
    try {
      const res = await fetch('http://localhost:5000/api/sets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, title: newSetTitle, description: newSetDesc })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Lỗi tạo bộ flashcard');
      setSets([...sets, data]);
      setSelectedSetId(data.id);
      setShowAddSet(false);
      setNewSetTitle('');
      setNewSetDesc('');
    } catch (err) {
      setErrorAdd(err.message);
    } finally {
      setLoadingAdd(false);
    }
  };

  // State cho modal sửa tên/thêm ghi chú bộ flashcard
  const [showEditSet, setShowEditSet] = useState(false);
  const [editSetData, setEditSetData] = useState(null);
  const [editSetLoading, setEditSetLoading] = useState(false);
  const [editSetError, setEditSetError] = useState('');

  // Hàm mở modal sửa tên/thêm ghi chú
  const handleEditSet = (set) => {
    setShowEditSet(true);
    setEditSetData({ ...set });
    setMenuOpenId(null);
  };
  // Hàm submit sửa tên/thêm ghi chú
  const handleEditSetSubmit = async (e) => {
    e.preventDefault();
    setEditSetLoading(true);
    setEditSetError('');
    try {
      const res = await fetch(`http://localhost:5000/api/sets/${editSetData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editSetData.title, description: editSetData.description })
      });
      if (!res.ok) throw new Error('Lỗi sửa bộ flashcard');
      setShowEditSet(false);
      // Reload danh sách bộ thẻ
      const res2 = await fetch(`http://localhost:5000/api/sets?user_id=${user_id}`);
      const data2 = await res2.json();
      if (res2.ok) setSets(data2);
    } catch (err) {
      setEditSetError('Lỗi sửa bộ flashcard');
    } finally {
      setEditSetLoading(false);
    }
  };
  // Sửa lại logic xóa bộ flashcard để đồng bộ với backend mới
  const handleDeleteSet = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/sets/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Lỗi xóa bộ flashcard');
      setSets(sets.filter(set => set.id !== id));
      if (selectedSetId === id) {
        setSelectedSetId(sets.length > 1 ? sets.find(set => set.id !== id)?.id : null);
      }
      setMenuOpenId(null);
      // Nếu đang xem flashcards của bộ vừa xóa thì clear luôn
      if (selectedSetId === id) setFlashcards([]);
    } catch (err) {
      alert(err.message);
    }
  };

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.set-menu') && !e.target.closest('.set-menu-btn')) {
        setMenuOpenId(null);
      }
    };
    if (menuOpenId !== null) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [menuOpenId]);

  // State cho modal thêm từ vựng
  const [showAddVocab, setShowAddVocab] = useState(false);
  const [addVocabSetId, setAddVocabSetId] = useState(null);
  const [vocabFront, setVocabFront] = useState('');
  const [vocabPhonetic, setVocabPhonetic] = useState('');
  const [vocabBack, setVocabBack] = useState('');
  const [vocabImage, setVocabImage] = useState(null);
  const [addVocabLoading, setAddVocabLoading] = useState(false);
  const [addVocabError, setAddVocabError] = useState('');

  // State cho danh sách từ vựng của bộ thẻ được chọn
  const [flashcards, setFlashcards] = useState([]);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);
  const [errorFlashcards, setErrorFlashcards] = useState('');

  // State cho quiz flashcard
  const [quizIndex, setQuizIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset quizIndex khi đổi bộ thẻ hoặc danh sách flashcards thay đổi
  useEffect(() => {
    setQuizIndex(0);
    setIsFlipped(false);
  }, [selectedSetId, flashcards]);

  // Hàm mở modal thêm từ vựng cho set cụ thể
  const handleShowAddVocab = (setId) => {
    setAddVocabSetId(setId);
    setShowAddVocab(true);
    setVocabFront(''); setVocabPhonetic(''); setVocabBack(''); setVocabImage(null); setAddVocabError('');
  };

  // Hàm submit thêm từ vựng
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
      // Reload flashcards list sau khi thêm thành công
      if (addVocabSetId === selectedSetId) {
        // Gọi lại fetch flashcards
        const res = await fetch(`http://localhost:5000/api/sets/${selectedSetId}/flashcards`);
        const data = await res.json();
        if (res.ok) setFlashcards(data);
      }
    } catch (err) {
      setAddVocabError(err.message);
    } finally {
      setAddVocabLoading(false);
    }
  };

  // Fetch flashcards khi selectedSetId thay đổi hoặc sau khi thêm mới
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
      } catch (err) {
        setErrorFlashcards(err.message);
      } finally {
        setLoadingFlashcards(false);
      }
    };
    fetchFlashcards();
  }, [selectedSetId]);

  // State lưu trạng thái đã thuộc/chưa thuộc cho từng flashcard (giả lập, chưa kết nối API)
  const [learnedStatus, setLearnedStatus] = useState({}); // { [flashcardId]: true/false }
  // State để quiz chỉ hiện flashcard chưa thuộc, trừ khi quizFromVocabId có giá trị
  const [quizFromVocabId, setQuizFromVocabId] = useState(null);

  // Hàm toggle trạng thái đã thuộc
  const handleToggleLearned = (id) => {
    setLearnedStatus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Danh sách flashcards cho quiz: nếu quizFromVocabId có giá trị thì chỉ hiện flashcard đó, ngược lại chỉ hiện flashcard chưa thuộc
  const quizFlashcards = quizFromVocabId
    ? flashcards.filter(card => card.id === quizFromVocabId)
    : flashcards.filter(card => !learnedStatus[card.id]);

  // Khi bấm vào từ vựng đã thuộc, mở quiz với từ đó
  const handleVocabClick = (card) => {
    if (learnedStatus[card.id]) {
      setQuizFromVocabId(card.id);
      setQuizIndex(0);
      setIsFlipped(false);
    }
  };

  // Khi chuyển quiz, nếu đang ở chế độ quizFromVocabId thì reset về quiz bình thường
  const handleQuizNext = () => {
    if (quizFromVocabId) {
      setQuizFromVocabId(null);
      setQuizIndex(0);
      setIsFlipped(false);
    } else {
      setQuizIndex(i => (i+1)%quizFlashcards.length);
      setIsFlipped(false);
    }
  };
  const handleQuizPrev = () => {
    if (quizFromVocabId) {
      setQuizFromVocabId(null);
      setQuizIndex(0);
      setIsFlipped(false);
    } else {
      setQuizIndex(i => (i-1+quizFlashcards.length)%quizFlashcards.length);
      setIsFlipped(false);
    }
  };

  // State cho menu 3 chấm từng từ vựng
  const [vocabMenuOpenId, setVocabMenuOpenId] = useState(null);
  // State cho modal sửa từ vựng
  const [showEditVocab, setShowEditVocab] = useState(false);
  const [editVocabData, setEditVocabData] = useState(null);
  // State cho modal xác nhận xóa từ vựng
  const [showDeleteVocab, setShowDeleteVocab] = useState(false);
  const [deleteVocabId, setDeleteVocabId] = useState(null);

  // Hàm mở menu 3 chấm
  const handleOpenVocabMenu = (id, e) => {
    e.stopPropagation();
    setVocabMenuOpenId(id === vocabMenuOpenId ? null : id);
  };
  // Hàm mở modal sửa từ vựng
  const handleEditVocab = (card) => {
    setShowEditVocab(true);
    setEditVocabData(card);
    setEditVocabImage(null); // reset ảnh mới
    setEditVocabImageUrl(card.image_url || '');
    setVocabMenuOpenId(null);
  };
  // Hàm mở modal xóa từ vựng
  const handleDeleteVocab = (id) => {
    setShowDeleteVocab(true);
    setDeleteVocabId(id);
    setVocabMenuOpenId(null);
  };
  // Xử lý xóa từ vựng
  const [deleteVocabLoading, setDeleteVocabLoading] = useState(false);
  const [deleteVocabError, setDeleteVocabError] = useState('');
  const confirmDeleteVocab = async () => {
    setDeleteVocabLoading(true);
    setDeleteVocabError('');
    try {
      await fetch(`http://localhost:5000/api/sets/${selectedSetId}/flashcards/${deleteVocabId}`, { method: 'DELETE' });
      setShowDeleteVocab(false);
      setDeleteVocabId(null);
      // Reload flashcards
      const res = await fetch(`http://localhost:5000/api/sets/${selectedSetId}/flashcards`);
      const data = await res.json();
      if (res.ok) setFlashcards(data);
    } catch (err) {
      setDeleteVocabError('Lỗi xóa từ vựng');
    } finally {
      setDeleteVocabLoading(false);
    }
  };

  // Xử lý sửa từ vựng
  const [editVocabLoading, setEditVocabLoading] = useState(false);
  const [editVocabError, setEditVocabError] = useState('');
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
      // Reload flashcards
      const res2 = await fetch(`http://localhost:5000/api/sets/${selectedSetId}/flashcards`);
      const data2 = await res2.json();
      if (res2.ok) setFlashcards(data2);
    } catch (err) {
      setEditVocabError('Lỗi sửa từ vựng');
    } finally {
      setEditVocabLoading(false);
    }
  };

  // State cho ảnh mới khi sửa từ vựng
  const [editVocabImage, setEditVocabImage] = useState(null);
  // State cho URL ảnh khi thêm/sửa từ vựng
  const [vocabImageUrl, setVocabImageUrl] = useState('');
  const [editVocabImageUrl, setEditVocabImageUrl] = useState('');

  // Hàm phát âm từ vựng (Text-to-Speech)
  const speak = (text, lang = 'ja-JP') => {
    if (!window.speechSynthesis) return;
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = lang;
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="dashboard-3col-container">
      {/* Cột 1: Sidebar quản lý bộ thẻ */}
      <aside className="dashboard-sidebar dashboard-col">
        <button
          className="back-btn"
          style={{ position: 'absolute', top: 18, left: 18, minWidth: 70, padding: '4px 16px', fontSize: '0.95rem' }}
          onClick={() => navigate(-1)}
        >
          BACK
        </button>
        <div className="home-header-jp" style={{ marginTop: 32 }}>
          <h2>Bộ Flashcard</h2>
          <button
            className="jp-btn-main"
            style={{ marginBottom: 12,marginLeft:15, width: '100%', padding: '0.6rem 1.4rem', fontSize:'0.9rem' }}
            onClick={() => setShowAddSet(true)}
          >
            + Tạo bộ mới
          </button>
        </div>
        {loadingSets ? (
          <div style={{ marginTop: 32, color: '#888' }}>Đang tải...</div>
        ) : errorSets ? (
          <div style={{ marginTop: 32, color: '#e63946' }}>{errorSets}</div>
        ) : (
          <div className="flashcard-set-list-jp">
            {currentSets.map(set => (
              <div
                  className={`flashcard-set-jp${set.id === selectedSetId ? ' selected' : ''}`}
                  key={set.id}
                  onClick={() => setSelectedSetId(set.id)}
              >
            {/* Nút 3 chấm dọc */}
          <button
            className="set-menu-btn"
            onClick={e => {
            e.stopPropagation();
            setMenuOpenId(set.id === menuOpenId ? null : set.id);
        }}
        tabIndex={-1}
        >
          <span>&#8942;</span>
      </button>

            {/*     Menu option */}
        {menuOpenId === set.id && (
          <div className="set-menu" onClick={e => e.stopPropagation()}>
            <button className="set-menu-option blue" onClick={() => handleEditSet(set)}>Sửa tên</button>
            <button className="set-menu-option orange" onClick={() => handleEditSet(set)}>Thêm ghi chú</button>
            <button className="set-menu-option red" onClick={() => handleDeleteSet(set.id)}>Xóa bộ Flashcard</button>
          </div>
  )       }

        <div className="set-content">
          <h3>{set.title}</h3>
          <p>{set.description}</p>
        </div>
      </div>

              
            ))}
          </div>
        )}
        <div className='pagination'>
          {renderPagination()}
        </div>
        {showAddSet && (
          <div className="modal-bg">
            <div className="modal-add-set">
              <h3>Tạo bộ flashcard mới</h3>
              <input
                type="text"
                placeholder="Tên chủ đề..."
                value={newSetTitle}
                onChange={e => setNewSetTitle(e.target.value)}
                style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
                autoFocus
                disabled={loadingAdd}
              />
              <textarea
                placeholder="Mô tả (không bắt buộc)"
                value={newSetDesc}
                onChange={e => setNewSetDesc(e.target.value)}
                style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc', minHeight: 48 }}
                disabled={loadingAdd}
              />
              {errorAdd && <div style={{ color: '#e63946', marginBottom: 8 }}>{errorAdd}</div>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button className="jp-btn-main" onClick={handleAddSet} style={{ minWidth: 80 }} disabled={loadingAdd}>{loadingAdd ? 'Đang tạo...' : 'Tạo'}</button>
                <button className="jp-btn-main" onClick={() => setShowAddSet(false)} style={{ background: '#eee', color: '#e63946', border: 'none' }} disabled={loadingAdd}>Huỷ</button>
              </div>
            </div>
          </div>
        )}
        {/* Modal thêm từ vựng */}
        {showAddVocab && (
          <div className="modal-bg">
            <form className="modal-add-vocab" onSubmit={handleAddVocab} encType="multipart/form-data">
              <h3>Thêm từ vựng vào bộ thẻ</h3>
              <input type="text" placeholder="Từ vựng" value={vocabFront} onChange={e => setVocabFront(e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} required disabled={addVocabLoading} />
              <input type="text" placeholder="Phiên âm (nếu có)" value={vocabPhonetic} onChange={e => setVocabPhonetic(e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} disabled={addVocabLoading} />
              <input type="text" placeholder="Ý nghĩa" value={vocabBack} onChange={e => setVocabBack(e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} required disabled={addVocabLoading} />
              <input type="text" placeholder="Hoặc dán URL ảnh minh họa (tùy chọn)" value={vocabImageUrl} onChange={e => setVocabImageUrl(e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} disabled={addVocabLoading} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span>Hoặc tải ảnh minh họa:</span>
                <input type="file" accept="image/*" onChange={e => setVocabImage(e.target.files[0])} disabled={addVocabLoading} style={{ display: 'none' }} id="vocab-image-upload" />
                <button type="button" onClick={() => document.getElementById('vocab-image-upload').click()} style={{ fontSize: 22, border: 'none', background: '#ffce00', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                {vocabImage && <span style={{ fontSize: 13, color: '#3b4cca' }}>{vocabImage.name}</span>}
              </label>
              {addVocabError && <div style={{ color: '#e63946', marginBottom: 8 }}>{addVocabError}</div>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button className="jp-btn-main" type="submit" disabled={addVocabLoading}>{addVocabLoading ? 'Đang thêm...' : 'Thêm từ vựng'}</button>
                <button className="jp-btn-main" type="button" onClick={() => setShowAddVocab(false)} style={{ background: '#eee', color: '#e63946', border: 'none' }} disabled={addVocabLoading}>Huỷ</button>
              </div>
            </form>
          </div>
        )}
        {/* Modal sửa tên/thêm ghi chú bộ flashcard */}
        {showEditSet && editSetData && (
          <div className="modal-bg">
            <form className="modal-add-set" onSubmit={handleEditSetSubmit}>
              <h3>Sửa bộ flashcard</h3>
              <input type="text" placeholder="Tên chủ đề..." value={editSetData.title} onChange={e => setEditSetData({ ...editSetData, title: e.target.value })} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} required disabled={editSetLoading} />
              <textarea placeholder="Mô tả/Ghi chú (không bắt buộc)" value={editSetData.description || ''} onChange={e => setEditSetData({ ...editSetData, description: e.target.value })} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc', minHeight: 48 }} disabled={editSetLoading} />
              {editSetError && <div style={{ color: '#e63946', marginBottom: 8 }}>{editSetError}</div>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button className="jp-btn-main" type="submit" disabled={editSetLoading}>{editSetLoading ? 'Đang lưu...' : 'Lưu'}</button>
                <button className="jp-btn-main" type="button" onClick={() => setShowEditSet(false)} style={{ background: '#eee', color: '#e63946', border: 'none' }} disabled={editSetLoading}>Huỷ</button>
              </div>
            </form>
          </div>
        )}
        {/* Modal sửa từ vựng */}
        {showEditVocab && editVocabData && (
          <div className="modal-bg">
            <form className="modal-add-vocab" onSubmit={handleEditVocabSubmit} encType="multipart/form-data">
              <h3>Sửa thông tin từ vựng</h3>
              <input type="text" placeholder="Từ vựng" value={editVocabData.front} onChange={e => setEditVocabData({ ...editVocabData, front: e.target.value })} style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} required disabled={editVocabLoading} />
              <input type="text" placeholder="Phiên âm (nếu có)" value={editVocabData.phonetic || ''} onChange={e => setEditVocabData({ ...editVocabData, phonetic: e.target.value })} style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} disabled={editVocabLoading} />
              <input type="text" placeholder="Ý nghĩa" value={editVocabData.back} onChange={e => setEditVocabData({ ...editVocabData, back: e.target.value })} style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} required disabled={editVocabLoading} />
              <input type="text" placeholder="Hoặc dán URL ảnh minh họa (tùy chọn)" value={editVocabImageUrl} onChange={e => setEditVocabImageUrl(e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} disabled={editVocabLoading} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span>Hoặc tải ảnh minh họa:</span>
                <input type="file" accept="image/*" style={{ display: 'none' }} id="edit-vocab-image-upload" disabled={editVocabLoading} onChange={e => setEditVocabImage(e.target.files[0])} />
                <button type="button" onClick={() => document.getElementById('edit-vocab-image-upload').click()} style={{ fontSize: 22, border: 'none', background: '#ffce00', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} disabled={editVocabLoading}>+</button>
                {(editVocabData.image_url || editVocabImage) && <span style={{ fontSize: 13, color: '#3b4cca' }}>{editVocabImage ? editVocabImage.name : 'Đã có ảnh'}</span>}
              </label>
              {editVocabError && <div style={{ color: '#e63946', marginBottom: 8 }}>{editVocabError}</div>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button className="jp-btn-main" type="submit" disabled={editVocabLoading}>{editVocabLoading ? 'Đang lưu...' : 'Lưu'}</button>
                <button className="jp-btn-main" type="button" onClick={() => setShowEditVocab(false)} style={{ background: '#eee', color: '#e63946', border: 'none' }} disabled={editVocabLoading}>Huỷ</button>
              </div>
            </form>
          </div>
        )}
        {/* Modal xác nhận xóa từ vựng */}
        {showDeleteVocab && (
          <div className="modal-bg">
            <div className="modal-add-vocab" style={{ maxWidth: 340 }}>
              <h3>Bạn có muốn xóa từ vựng này không?</h3>
              {deleteVocabError && <div style={{ color: '#e63946', marginBottom: 8 }}>{deleteVocabError}</div>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
                <button className="jp-btn-main" onClick={confirmDeleteVocab} disabled={deleteVocabLoading}>{deleteVocabLoading ? 'Đang xóa...' : 'Xóa'}</button>
                <button className="jp-btn-main" onClick={() => setShowDeleteVocab(false)} style={{ background: '#eee', color: '#e63946', border: 'none' }} disabled={deleteVocabLoading}>Huỷ</button>
              </div>
            </div>
          </div>
        )}
      </aside>
      {/* Cột 2: Danh sách từ vựng */}
      <section className="dashboard-vocab dashboard-col">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{marginBottom: 0}}>Từ vựng trong bộ thẻ</h2>
          {selectedSetId && (
            <button
              className="add-vocab-btn"
              title="Thêm từ vựng"
              style={{ background: '#2ecc40', color: '#fff', border: 'none', borderRadius: '50%', width: 48, height: 48, fontSize: 32, fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 8px #2ecc4022', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => {
                setShowAddVocab(true);
                setAddVocabSetId(selectedSetId); // Sửa lỗi null
                setVocabFront('');
                setVocabPhonetic('');
                setVocabBack('');
                setVocabImage(null);
                setVocabImageUrl('');
                setAddVocabError('');
              }}
            >
              +
            </button>
          )}
        </div>
        <div className="vocab-list">
          {loadingFlashcards ? (
            <div style={{ color: '#888' }}>Đang tải từ vựng...</div>
          ) : errorFlashcards ? (
            <div style={{ color: '#e63946' }}>{errorFlashcards}</div>
          ) : flashcards.length === 0 ? (
            <div style={{ color: '#888' }}>Chưa có từ vựng nào trong bộ này.</div>
          ) : (
            flashcards.map(card => (
              <div className="vocab-item" key={card.id} onClick={() => handleVocabClick(card)} style={{ cursor: learnedStatus[card.id] ? 'pointer' : 'default', position: 'relative' }}>
                {/* Nút 3 chấm xanh biển */}
                <button className="vocab-menu-btn" style={{ position: 'absolute', top: 8, left: 8, background: 'none', border: 'none', cursor: 'pointer', zIndex: 2 }} onClick={e => handleOpenVocabMenu(card.id, e)}>
                  <span style={{ fontSize: 22, color: '#3b4cca', fontWeight: 'bold', letterSpacing: 1 }}>&#8942;</span>
                </button>
                {vocabMenuOpenId === card.id && (
                  <div className="vocab-menu" style={{ position: 'absolute', top: 36, left: 8, background: '#fff', border: '1px solid #eee', borderRadius: 8, boxShadow: '0 4px 16px #3b4cca33', zIndex: 10, minWidth: 140 }} onClick={e => e.stopPropagation()}>
                    <button className="vocab-menu-option" style={{ color: '#3b4cca' }} onClick={() => handleEditVocab(card)}>Sửa thông tin từ vựng</button>
                    <button className="vocab-menu-option" style={{ color: '#e63946' }} onClick={() => handleDeleteVocab(card.id)}>Xóa từ vựng</button>
                  </div>
                )}
            
                {/* Left part: word, phonetic, note */}
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
            
                {/* Middle part: status, checkbox */}
                <div className="vocab-status-controls">
                  <span className={`vocab-status${learnedStatus[card.id] ? ' learned' : ''}`}>{learnedStatus[card.id] ? 'Đã thuộc' : 'Chưa thuộc'}</span>
                  <input type="checkbox" checked={!!learnedStatus[card.id]} onChange={e => { e.stopPropagation(); handleToggleLearned(card.id); }} style={{ accentColor: '#2ecc40', width: 18, height: 18 }} />
                </div>
            
                {/* Right part: image */}
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
      </section>
      {/* Cột 3: Quiz flashcard */}
      <section className="dashboard-quiz dashboard-col">
        <h2 style={{marginBottom: 16}}>Quiz Flashcard</h2>
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
                {/*   Hiển thị ảnh: ưu tiên URL trước, file sau */}
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
            <div style={{marginTop:8, fontSize:13, color:'#888'}}>Bấm vào thẻ để lật</div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
