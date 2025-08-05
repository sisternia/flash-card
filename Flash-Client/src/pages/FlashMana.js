import React, { useEffect, useState, useRef } from 'react';
import './FlashMana.css';
import './Home.css';
import Modals from '../components/Modals';

const FlashMana = ({ user_id, navigate, selectedSetId, setSelectedSetId }) => {
  const [sets, setSets] = useState([]);
  const [showAddSet, setShowAddSet] = useState(false);
  const [newSetTitle, setNewSetTitle] = useState('');
  const [newSetDesc, setNewSetDesc] = useState('');
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [errorAdd, setErrorAdd] = useState('');
  const [loadingSets, setLoadingSets] = useState(true);
  const [errorSets, setErrorSets] = useState('');
  const [showEditSet, setShowEditSet] = useState(false);
  const [editSetData, setEditSetData] = useState(null);
  const [editSetLoading, setEditSetLoading] = useState(false);
  const [editSetError, setEditSetError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [setsPerPage, setSetsPerPage] = useState(3);

  const listRef = useRef();

  const indexOfLastSet = currentPage * setsPerPage;
  const indexOfFirstSet = indexOfLastSet - setsPerPage;
  const currentSets = sets.slice(indexOfFirstSet, indexOfLastSet);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pageCount = Math.ceil(sets.length / setsPerPage);
    if (pageCount <= 1) return null;

    const pages = [];
    if (pageCount <= 3) {
      for (let i = 1; i <= pageCount; i++) {
        pages.push(
          <button key={i} onClick={() => paginate(i)} className={currentPage === i ? 'active' : ''}>
            {i}
          </button>
        );
      }
    } else {
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
        startPage = currentPage - 1;
      }

      for (let i = 0; i < 3; i++) {
        const page = startPage + i;
        if (page <= pageCount) {
          pages.push(
            <button
              key={page}
              onClick={() => paginate(page)}
              className={currentPage === page ? 'active' : ''}
            >
              {page}
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

  useEffect(() => {
    const fetchSets = async () => {
      setLoadingSets(true);
      setErrorSets('');
      try {
        const res = await fetch(`http://localhost:5000/api/sets?user_id=${user_id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Lỗi tải danh sách bộ flashcard');
        setSets(data);
        if (data.length > 0 && !selectedSetId) {
          setSelectedSetId(data[0].id);
        }
      } catch (err) {
        setErrorSets(err.message);
      } finally {
        setLoadingSets(false);
      }
    };

    if (user_id) fetchSets();
  }, [user_id, setSelectedSetId, selectedSetId]);

  useEffect(() => {
    if (listRef.current) {
      const listHeight = listRef.current.clientHeight;
      const flashcardHeight = 170;
      const footerHeight = 64;
      const availableHeight = listHeight - footerHeight;
      const maxPerPage = Math.floor(availableHeight / flashcardHeight);
      setSetsPerPage(maxPerPage > 0 ? maxPerPage : 1);
    }
  }, [loadingSets, sets]);

  const handleAddSet = async () => {
    if (!newSetTitle.trim()) return;
    setLoadingAdd(true);
    setErrorAdd('');
    try {
      const res = await fetch('http://localhost:5000/api/sets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, title: newSetTitle, description: newSetDesc }),
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

  const handleEditSet = (set) => {
    setShowEditSet(true);
    setEditSetData({ ...set });
    setMenuOpenId(null);
  };

  const handleEditSetSubmit = async (e) => {
    e.preventDefault();
    setEditSetLoading(true);
    setEditSetError('');
    try {
      const res = await fetch(`http://localhost:5000/api/sets/${editSetData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editSetData.title, description: editSetData.description }),
      });
      if (!res.ok) throw new Error('Lỗi sửa bộ flashcard');
      setShowEditSet(false);
      const res2 = await fetch(`http://localhost:5000/api/sets?user_id=${user_id}`);
      const data2 = await res2.json();
      if (res2.ok) setSets(data2);
    } catch (err) {
      setEditSetError('Lỗi sửa bộ flashcard');
    } finally {
      setEditSetLoading(false);
    }
  };

  const handleDeleteSet = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/sets/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Lỗi xóa bộ flashcard');
      const updatedSets = sets.filter((s) => s.id !== id);
      setSets(updatedSets);
      if (selectedSetId === id) {
        setSelectedSetId(updatedSets.length ? updatedSets[0].id : null);
      }
      setMenuOpenId(null);
    } catch (err) {
      alert(err.message);
    }
  };

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

  return (
    <>
      <aside className="dashboard-sidebar dashboard-col">
        <button
          className="back-btn"
          style={{
            position: 'absolute',
            top: 18,
            left: 18,
            minWidth: 70,
            padding: '4px 16px',
            fontSize: '0.95rem',
          }}
          onClick={() => navigate(-1)}
        >
          BACK
        </button>
        <div className="home-header-jp" style={{ marginTop: 32 }}>
          <h2>Bộ Flashcard</h2>
          <button
            className="jp-btn-main"
            style={{
              marginLeft: 15,
              width: '100%',
              padding: '0.5rem 1.3rem',
              fontSize: '0.9rem',
              background:'#e63946',
              color:'#fff'
            }}
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
          <div className="flashcard-set-list-jp" ref={listRef}>
            {currentSets.map((set) => (
              <div
                className={`flashcard-set${set.id === selectedSetId ? ' selected' : ''}`}
                key={set.id}
                onClick={() => setSelectedSetId(set.id)}
              >
                <button
                  className="set-menu-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(set.id === menuOpenId ? null : set.id);
                  }}
                  tabIndex={-1}
                >
                  <span>&#8942;</span>
                </button>
                {menuOpenId === set.id && (
                  <div className="set-menu" onClick={(e) => e.stopPropagation()}>
                    <button className="set-menu-option blue" onClick={() => handleEditSet(set)}>
                      Sửa tên
                    </button>
                    <button className="set-menu-option orange" onClick={() => handleEditSet(set)}>
                      Thêm ghi chú
                    </button>
                    <button className="set-menu-option red" onClick={() => handleDeleteSet(set.id)}>
                      Xóa bộ Flashcard
                    </button>
                  </div>
                )}
                <div className="set-content">
                  <h3>{set.title}</h3>
                  <p>{set.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="pagination">{renderPagination()}</div>
      </aside>

      <Modals
        showAddSet={showAddSet}
        setShowAddSet={setShowAddSet}
        newSetTitle={newSetTitle}
        setNewSetTitle={setNewSetTitle}
        newSetDesc={newSetDesc}
        setNewSetDesc={setNewSetDesc}
        loadingAdd={loadingAdd}
        errorAdd={errorAdd}
        handleAddSet={handleAddSet}
        showEditSet={showEditSet}
        setShowEditSet={setShowEditSet}
        editSetData={editSetData}
        setEditSetData={setEditSetData}
        editSetLoading={editSetLoading}
        editSetError={editSetError}
        handleEditSetSubmit={handleEditSetSubmit}
      />
    </>
  );
};

export default FlashMana;
