const API_BASE_URL = 'http://localhost:5000/api';
const BASE_URL = 'http://localhost:5000';

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const checkUser = async (email) => {
  const res = await fetch(`${API_BASE_URL}/auth/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res;
};

export const registerUser = async (email, username, password) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password }),
  });
  return res;
};

export const getUserSets = async (user_id) => {
  const res = await fetch(`${API_BASE_URL}/sets?user_id=${user_id}`);
  return res.json();
};

export const getFlashcardsBySetId = async (setId) => {
  const res = await fetch(`${API_BASE_URL}/sets/${setId}/flashcards`);
  return res.json();
};

export const addFlashcardToSet = async (setId, formData) => {
  const res = await fetch(`${API_BASE_URL}/sets/${setId}/flashcards`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Lỗi thêm từ vựng');
  return data;
};

export const deleteFlashcardFromSet = async (setId, flashcardId) => {
  const res = await fetch(`${API_BASE_URL}/sets/${setId}/flashcards/${flashcardId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Lỗi xóa từ vựng');
};

export const updateFlashcardInSet = async (setId, flashcardId, formData) => {
  const res = await fetch(`${API_BASE_URL}/sets/${setId}/flashcards/${flashcardId}`, {
    method: 'PUT',
    body: formData,
  });
  if (!res.ok) throw new Error('Lỗi sửa từ vựng');
};

export const getUserProfile = async (userId) => {
  const res = await fetch(`${API_BASE_URL}/auth/profile/${userId}`);
  return res.json();
};

export const updateUsername = async (userId, newUsername) => {
  const res = await fetch(`${API_BASE_URL}/auth/update-username/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newUsername }),
  });
  return res.json();
};

export const updatePassword = async (userId, oldPassword, newPassword) => {
  const res = await fetch(`${API_BASE_URL}/auth/update-password/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldPassword, newPassword }),
  });
  return res.json();
};

export const getImageUrl = (imagePath) => {
  return imagePath?.startsWith('http') ? imagePath : `${BASE_URL}${imagePath}`;
};

export const fetchUserSets = async (user_id) => {
  const res = await fetch(`${API_BASE_URL}/sets?user_id=${user_id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Lỗi tải danh sách bộ flashcard');
  return data;
};

export const createSet = async (user_id, title, description) => {
  const res = await fetch(`${API_BASE_URL}/sets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, title, description }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Lỗi tạo bộ flashcard');
  return data;
};

export const updateSet = async (id, title, description) => {
  const res = await fetch(`${API_BASE_URL}/sets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
  if (!res.ok) throw new Error('Lỗi sửa bộ flashcard');
};

export const deleteSet = async (id) => {
  const res = await fetch(`${API_BASE_URL}/sets/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Lỗi xóa bộ flashcard');
  return data;
};

export const getAllUsers = async () => {
  const res = await fetch(`${API_BASE_URL}/auth/users`);
  if (!res.ok) throw new Error('Lỗi tải danh sách người dùng');
  return res.json();
};