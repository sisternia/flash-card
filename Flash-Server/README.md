# Backend Flashcard App

## Hướng dẫn cấu hình

1. **Tạo file `.env` trong thư mục `server` với nội dung:**

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=flashcard_app
JWT_SECRET=your_jwt_secret
PORT=5000
```

2. **Tạo database và các bảng MySQL bằng file `schema.sql` (bên dưới):**

## Cấu trúc bảng mẫu (schema.sql)

```sql
CREATE DATABASE IF NOT EXISTS flashcard_app;
USE flashcard_app;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE flashcard_sets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE flashcards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  set_id INT NOT NULL,
  front VARCHAR(255) NOT NULL,
  back VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (set_id) REFERENCES flashcard_sets(id) ON DELETE CASCADE
);

CREATE TABLE user_flashcard_status (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  flashcard_id INT NOT NULL,
  is_learned BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (flashcard_id) REFERENCES flashcards(id) ON DELETE CASCADE
);
``` 