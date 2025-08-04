import React from 'react';
import './Modals.css';
import '../pages/Home.css';

const Modals = ({
  // FlashMana modals
  showAddSet,
  setShowAddSet,
  newSetTitle,
  setNewSetTitle,
  newSetDesc,
  setNewSetDesc,
  loadingAdd,
  errorAdd,
  handleAddSet,
  showEditSet,
  setShowEditSet,
  editSetData,
  setEditSetData,
  editSetLoading,
  editSetError,
  handleEditSetSubmit,
  // FlashVoca modals
  showAddVocab,
  setShowAddVocab,
  vocabFront,
  setVocabFront,
  vocabPhonetic,
  setVocabPhonetic,
  vocabBack,
  setVocabBack,
  vocabImage,
  setVocabImage,
  vocabImageUrl,
  setVocabImageUrl,
  addVocabLoading,
  addVocabError,
  handleAddVocab,
  showEditVocab,
  setShowEditVocab,
  editVocabData,
  setEditVocabData,
  editVocabImage,
  setEditVocabImage,
  editVocabImageUrl,
  setEditVocabImageUrl,
  editVocabLoading,
  editVocabError,
  handleEditVocabSubmit,
  showDeleteVocab,
  setShowDeleteVocab,
  deleteVocabLoading,
  deleteVocabError,
  confirmDeleteVocab
}) => {
  return (
    <>
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
              <button className="jp-btn-main" onClick={handleAddSet} style={{ minWidth: 80 }} disabled={loadingAdd}>
                {loadingAdd ? 'Đang tạo...' : 'Tạo'}
              </button>
              <button
                className="jp-btn-main"
                onClick={() => setShowAddSet(false)}
                style={{ background: '#eee', color: '#e63946', border: 'none' }}
                disabled={loadingAdd}
              >
                Huỷ
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditSet && editSetData && (
        <div className="modal-bg">
          <form className="modal-add-set" onSubmit={handleEditSetSubmit}>
            <h3>Sửa bộ flashcard</h3>
            <input
              type="text"
              placeholder="Tên chủ đề..."
              value={editSetData.title}
              onChange={e => setEditSetData({ ...editSetData, title: e.target.value })}
              style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
              required
              disabled={editSetLoading}
            />
            <textarea
              placeholder="Mô tả/Ghi chú (không bắt buộc)"
              value={editSetData.description || ''}
              onChange={e => setEditSetData({ ...editSetData, description: e.target.value })}
              style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc', minHeight: 48 }}
              disabled={editSetLoading}
            />
            {editSetError && <div style={{ color: '#e63946', marginBottom: 8 }}>{editSetError}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="jp-btn-main" type="submit" disabled={editSetLoading}>
                {editSetLoading ? 'Đang lưu...' : 'Lưu'}
              </button>
              <button
                className="jp-btn-main"
                type="button"
                onClick={() => setShowEditSet(false)}
                style={{ background: '#eee', color: '#e63946', border: 'none' }}
                disabled={editSetLoading}
              >
                Huỷ
              </button>
            </div>
          </form>
        </div>
      )}
      {showAddVocab && (
        <div className="modal-bg">
          <form className="modal-add-vocab" onSubmit={handleAddVocab} encType="multipart/form-data">
            <h3>Thêm từ vựng vào bộ thẻ</h3>
            <input
              type="text"
              placeholder="Từ vựng"
              value={vocabFront}
              onChange={e => setVocabFront(e.target.value)}
              style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
              required
              disabled={addVocabLoading}
            />
            <input
              type="text"
              placeholder="Phiên âm (nếu có)"
              value={vocabPhonetic}
              onChange={e => setVocabPhonetic(e.target.value)}
              style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
              disabled={addVocabLoading}
            />
            <input
              type="text"
              placeholder="Ý nghĩa"
              value={vocabBack}
              onChange={e => setVocabBack(e.target.value)}
              style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
              required
              disabled={addVocabLoading}
            />
            <input
              type="text"
              placeholder="Hoặc dán URL ảnh minh họa (tùy chọn)"
              value={vocabImageUrl}
              onChange={e => setVocabImageUrl(e.target.value)}
              style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
              disabled={addVocabLoading}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span>Hoặc tải ảnh minh họa:</span>
              <input
                type="file"
                accept="image/*"
                onChange={e => setVocabImage(e.target.files[0])}
                disabled={addVocabLoading}
                style={{ display: 'none' }}
                id="vocab-image-upload"
              />
              <button
                type="button"
                onClick={() => document.getElementById('vocab-image-upload').click()}
                style={{ fontSize: 22, border: 'none', background: '#ffce00', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                +
              </button>
              {vocabImage && <span style={{ fontSize: 13, color: '#3b4cca' }}>{vocabImage.name}</span>}
            </label>
            {addVocabError && <div style={{ color: '#e63946', marginBottom: 8 }}>{addVocabError}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="jp-btn-main" type="submit" disabled={addVocabLoading}>
                {addVocabLoading ? 'Đang thêm...' : 'Thêm từ vựng'}
              </button>
              <button
                className="jp-btn-main"
                type="button"
                onClick={() => setShowAddVocab(false)}
                style={{ background: '#eee', color: '#e63946', border: 'none' }}
                disabled={addVocabLoading}
              >
                Huỷ
              </button>
            </div>
          </form>
        </div>
      )}
      {showEditVocab && editVocabData && (
        <div className="modal-bg">
          <form className="modal-add-vocab" onSubmit={handleEditVocabSubmit} encType="multipart/form-data">
            <h3>Sửa thông tin từ vựng</h3>
            <input
              type="text"
              placeholder="Từ vựng"
              value={editVocabData.front}
              onChange={e => setEditVocabData({ ...editVocabData, front: e.target.value })}
              style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
              required
              disabled={editVocabLoading}
            />
            <input
              type="text"
              placeholder="Phiên âm (nếu có)"
              value={editVocabData.phonetic || ''}
              onChange={e => setEditVocabData({ ...editVocabData, phonetic: e.target.value })}
              style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
              disabled={editVocabLoading}
            />
            <input
              type="text"
              placeholder="Ý nghĩa"
              value={editVocabData.back}
              onChange={e => setEditVocabData({ ...editVocabData, back: e.target.value })}
              style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
              required
              disabled={editVocabLoading}
            />
            <input
              type="text"
              placeholder="Hoặc dán URL ảnh minh họa (tùy chọn)"
              value={editVocabImageUrl}
              onChange={e => setEditVocabImageUrl(e.target.value)}
              style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
              disabled={editVocabLoading}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span>Hoặc tải ảnh minh họa:</span>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="edit-vocab-image-upload"
                disabled={editVocabLoading}
                onChange={e => setEditVocabImage(e.target.files[0])}
              />
              <button
                type="button"
                onClick={() => document.getElementById('edit-vocab-image-upload').click()}
                style={{ fontSize: 22, border: 'none', background: '#ffce00', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                disabled={editVocabLoading}
              >
                +
              </button>
              {(editVocabData.image_url || editVocabImage) && (
                <span style={{ fontSize: 13, color: '#3b4cca' }}>{editVocabImage ? editVocabImage.name : 'Đã có ảnh'}</span>
              )}
            </label>
            {editVocabError && <div style={{ color: '#e63946', marginBottom: 8 }}>{editVocabError}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="jp-btn-main" type="submit" disabled={editVocabLoading}>
                {editVocabLoading ? 'Đang lưu...' : 'Lưu'}
              </button>
              <button
                className="jp-btn-main"
                type="button"
                onClick={() => setShowEditVocab(false)}
                style={{ background: '#eee', color: '#e63946', border: 'none' }}
                disabled={editVocabLoading}
              >
                Huỷ
              </button>
            </div>
          </form>
        </div>
      )}
      {showDeleteVocab && (
        <div className="modal-bg">
          <div className="modal-add-vocab" style={{ maxWidth: 340 }}>
            <h3>Bạn có muốn xóa từ vựng này không?</h3>
            {deleteVocabError && <div style={{ color: '#e63946', marginBottom: 8 }}>{deleteVocabError}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
              <button className="jp-btn-main" onClick={confirmDeleteVocab} disabled={deleteVocabLoading}>
                {deleteVocabLoading ? 'Đang xóa...' : 'Xóa'}
              </button>
              <button
                className="jp-btn-main"
                onClick={() => setShowDeleteVocab(false)}
                style={{ background: '#eee', color: '#e63946', border: 'none' }}
                disabled={deleteVocabLoading}
              >
                Huỷ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modals;