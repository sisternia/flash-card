const API_BASE_URL = '/api';
const BASE_URL = 'https://www.nihonflashcard.live';

// Auth
export const loginUser = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include'   // gửi cookies
  });
  return res.json();
};

export const checkUser = async (email) => {
  const res = await fetch(`${API_BASE_URL}/auth/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    credentials: 'include'
  });
  return res;
};

export const registerUser = async (email, username, password) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password }),
    credentials: 'include'
  });
  return res;
};

// Flashcard sets
export const getUserSets = async (user_id) => {
  const res = await fetch(`${API_BASE_URL}/sets?user_id=${user_id}`, { credentials: 'include' });
  return res.json();
};

export const getFlashcardsBySetId = async (setId) => {
  const res = await fetch(`${API_BASE_URL}/sets/${setId}/flashcards`, { credentials: 'include' });
  return res.json();
};

export const addFlashcardToSet = async (setId, formData) => {
  const res = await fetch(`${API_BASE_URL}/sets/${setId}/flashcards`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Lỗi thêm từ vựng');
  return data;
};

export const deleteFlashcardFromSet = async (setId, flashcardId) => {
  const res = await fetch(`${API_BASE_URL}/sets/${setId}/flashcards/${flashcardId}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Lỗi xóa từ vựng');
};

export const updateFlashcardInSet = async (setId, flashcardId, formData) => {
  const res = await fetch(`${API_BASE_URL}/sets/${setId}/flashcards/${flashcardId}`, {
    method: 'PUT',
    body: formData,
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Lỗi sửa từ vựng');
};

// User profile
export const getUserProfile = async (userId) => {
  const res = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, { credentials: 'include' });
  return res.json();
};

export const updateUsername = async (userId, newUsername) => {
  const res = await fetch(`${API_BASE_URL}/auth/update-username/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newUsername }),
    credentials: 'include'
  });
  return res.json();
};

export const updatePassword = async (userId, oldPassword, newPassword) => {
  const res = await fetch(`${API_BASE_URL}/auth/update-password/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldPassword, newPassword }),
    credentials: 'include'
  });
  return res.json();
};

// Misc
export const getImageUrl = (imagePath) => {
  return imagePath?.startsWith('http') ? imagePath : `${BASE_URL}${imagePath}`;
};

export const fetchUserSets = async (user_id) => {
  const res = await fetch(`${API_BASE_URL}/sets?user_id=${user_id}`, { credentials: 'include' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Lỗi tải danh sách bộ flashcard');
  return data;
};

export const createSet = async (user_id, title, description) => {
  const res = await fetch(`${API_BASE_URL}/sets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, title, description }),
    credentials: 'include'
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
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Lỗi sửa bộ flashcard');
};

export const deleteSet = async (id) => {
  const res = await fetch(`${API_BASE_URL}/sets/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Lỗi xóa bộ flashcard');
  return data;
};

export const getAllUsersWithSetCount = async () => {
  const res = await fetch(`${API_BASE_URL}/auth/users`, { credentials: 'include' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Lỗi tải danh sách người dùng');
  return data;
};
