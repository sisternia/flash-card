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

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <button
          className="back-btn"
          style={{ position: 'absolute', top: 18, left: 18, minWidth: 70, padding: '4px 16px', fontSize: '0.95rem' }}
          onClick={() => navigate(-1)}
        >
          BACK
        </button>
        <div className="home-header-jp" style={{ marginTop: 32 }}>
          <h2>Bộ Flashcard của bạn</h2>
          <button
            className="jp-btn-main"
            style={{ marginBottom: 12, width: '100%' }}
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
            {sets.map(set => (
              <div
                className={`flashcard-set-jp${set.id === selectedSetId ? ' selected' : ''}`}
                key={set.id}
                onClick={() => setSelectedSetId(set.id)}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                {/* Nút 3 chấm dọc */}
                <button
                  className="set-menu-btn"
                  style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', zIndex: 2 }}
                  onClick={e => { e.stopPropagation(); setMenuOpenId(set.id === menuOpenId ? null : set.id); }}
                  tabIndex={-1}
                >
                  <span style={{ fontSize: 22, color: '#e63946', fontWeight: 'bold', letterSpacing: 1 }}>&#8942;</span>
                </button>
                {/* Menu option */}
                {menuOpenId === set.id && (
                  <div className="set-menu" style={{ position: 'absolute', top: 36, right: 8, background: '#fff', border: '1px solid #eee', borderRadius: 8, boxShadow: '0 4px 16px #e6394633', zIndex: 10, minWidth: 140 }} onClick={e => e.stopPropagation()}>
                    <button className="set-menu-option" style={{ color: '#3b4cca' }}>Sửa tên</button>
                    <button className="set-menu-option" style={{ color: '#ff9800' }}>Thêm ghi chú</button>
                    <button className="set-menu-option" style={{ color: '#e63946' }} onClick={() => handleDeleteSet(set.id)}>Xóa bộ Flashcard</button>
                  </div>
                )}
                <h3>{set.title}</h3>
                <p>{set.description}</p>
              </div>
            ))}
          </div>
        )}
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
      </aside>
      <main className="dashboard-main">
        <h2>Danh sách từ vựng</h2>
        <div className="flashcard-list">
          <p>Chọn một bộ flashcard để xem từ vựng.</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 