-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th7 31, 2025 lúc 04:59 AM
-- Phiên bản máy phục vụ: 10.4.28-MariaDB
-- Phiên bản PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `nihoncardsql`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `card_notes`
--

CREATE TABLE `card_notes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `flashcard_id` int(11) NOT NULL,
  `note_text` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `drag_drop_games`
--

CREATE TABLE `drag_drop_games` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `set_id` int(11) NOT NULL,
  `score` int(11) DEFAULT NULL,
  `played_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `flashcards`
--

CREATE TABLE `flashcards` (
  `id` int(11) NOT NULL,
  `set_id` int(11) NOT NULL,
  `front` varchar(255) NOT NULL,
  `back` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `image_url` varchar(255) DEFAULT NULL,
  `phonetic` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `flashcards`
--

INSERT INTO `flashcards` (`id`, `set_id`, `front`, `back`, `created_at`, `image_url`, `phonetic`) VALUES
(6, 10, 'ブドウ', 'Trái Nhooo\"s', '2025-07-29 08:21:00', '/uploads/40e826b52eb2e31e5485e3aefa3a9cde', 'budou'),
(12, 10, '進捗', 'Tiến độ', '2025-07-29 08:46:45', 'https://base.vn/wp-content/uploads/2024/08/cac-buoc-quan-ly-tien-do-du-an-1024x570.webp', 'しんちょく'),
(13, 10, 'バナナ', 'Chuoi', '2025-07-29 08:58:57', '/uploads/71afb7f30ffd7b29a1568a525f6d4686', 'banana'),
(14, 11, '父', 'Bố', '2025-07-29 09:02:54', 'https://img.lovepik.com/free-png/20211213/lovepik-dad-holding-a-baby-png-image_401563239_wh1200.png', 'chichi'),
(15, 11, '母', 'Me', '2025-07-29 09:03:47', 'https://img.lovepik.com/free-png/20210919/lovepik-a-mother-with-a-child-in-her-arms-png-image_400990936_wh1200.png', 'はは'),
(16, 11, '妹', 'Em gái', '2025-07-29 09:06:00', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8WLIHeOoTRED1cVbnC37Waogcnb8JohHaOcgzFfZmKAmqpMcjxgVCtYXlthqQFi1IHaYVceRAd3JYupBS-XiXQ9G7Nn79utT_j1lEegzeB2knIRvS1wkjJIGNpILGwk17OuH-cBXkWSs_FIY6-vBoL_td-LiklncBV9F6gWmb1yTCoqHYyWfechp9WBk/s453-r', 'いもうと'),
(17, 10, 'スイカ', 'dua hau', '2025-07-30 02:58:19', '/uploads/1f414c65f1addb1057a01c515f7c9b80', 'すいか'),
(20, 13, '母', 'Mẹ', '2025-07-31 02:59:09', '/uploads/614f26e4327f4ddea6bc606c04c99d59', 'はは');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `flashcard_sets`
--

CREATE TABLE `flashcard_sets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `flashcard_sets`
--

INSERT INTO `flashcard_sets` (`id`, `user_id`, `title`, `description`, `created_at`) VALUES
(10, 3, '果物ss', 'いろいろな果物の言葉を勉強しよう！！！：））sss', '2025-07-29 08:14:45'),
(11, 3, '家族', '家族の語彙を勉強しよう', '2025-07-29 09:00:06'),
(13, 10, '家族', NULL, '2025-07-31 02:58:51');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `quiz_results`
--

CREATE TABLE `quiz_results` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `set_id` int(11) NOT NULL,
  `score` int(11) DEFAULT NULL,
  `total_questions` int(11) DEFAULT NULL,
  `correct_answers` int(11) DEFAULT NULL,
  `taken_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `study_stats`
--

CREATE TABLE `study_stats` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `learned_count` int(11) DEFAULT 0,
  `review_count` int(11) DEFAULT 0,
  `time_spent` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `created_at`) VALUES
(1, 'testuser', '$2b$10$53vFbrxnyDDMgvZ2pzVik.mg.S0I3xwcNChQVv9JE/MQ6jLgfreUm', '2025-07-14 10:31:42'),
(2, 'cuong', '$2b$10$wOWDdm17wb6XWjp7eI0Oeu7Fap/eV.BwTiEjBFNshh3//EYf/K8gG', '2025-07-14 10:38:34'),
(3, 'cuog', '$2b$10$.U.f/qvC3uDTeyJDb7yQXekDmSCYmbI8iep/O7xm5OUIgqORDBENO', '2025-07-14 10:41:59'),
(4, 'yuikk', '$2b$10$YUXuGAZe2QYpjKjD8NHV7uPpZ9YLva5pM20zmeQkYKPIBLdtM7pwS', '2025-07-14 10:58:23'),
(5, 'win', '$2b$10$ssyORmymodtEYX6BRMM2O.fUOWSeRwE8O.d2RvO7Y.QdfDwPLMdnW', '2025-07-14 11:04:38'),
(6, 'hoctap1', '$2b$10$R2OEKaL5f7MpLYx9I8AZfOveGDKpKGNEx6ksLZ7z9TvCIMn98Wbea', '2025-07-14 11:15:14'),
(7, 'viii', '$2b$10$HKmArk5TCBWigq8m2hWyFegfaN2gJFWJggiEBU3US5ngM6WZYskXa', '2025-07-17 10:02:03'),
(8, 'minh', '$2b$10$b4maqsX.GBrQ12i9Gu/xwO8cShpdtGcy7HCyUI7elzir1zpoLhNrC', '2025-07-17 13:50:27'),
(9, 'duham', '$2b$10$WJ5xWiFxqG7iCEKVjhGJKOp5eTHPnIPG0gRk4FdZRwOlNRw/wNjKa', '2025-07-29 10:02:19'),
(10, 'vu', '$2b$10$.gKsoyARei.iHr2BUUh/4OPc2UVcFz71wm58TQiuGI/ciK7asFlgO', '2025-07-31 02:53:34');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_flashcard_status`
--

CREATE TABLE `user_flashcard_status` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `flashcard_id` int(11) NOT NULL,
  `is_learned` tinyint(1) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `card_notes`
--
ALTER TABLE `card_notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `flashcard_id` (`flashcard_id`);

--
-- Chỉ mục cho bảng `drag_drop_games`
--
ALTER TABLE `drag_drop_games`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `set_id` (`set_id`);

--
-- Chỉ mục cho bảng `flashcards`
--
ALTER TABLE `flashcards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `set_id` (`set_id`);

--
-- Chỉ mục cho bảng `flashcard_sets`
--
ALTER TABLE `flashcard_sets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `quiz_results`
--
ALTER TABLE `quiz_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `set_id` (`set_id`);

--
-- Chỉ mục cho bảng `study_stats`
--
ALTER TABLE `study_stats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Chỉ mục cho bảng `user_flashcard_status`
--
ALTER TABLE `user_flashcard_status`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `flashcard_id` (`flashcard_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `card_notes`
--
ALTER TABLE `card_notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `drag_drop_games`
--
ALTER TABLE `drag_drop_games`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `flashcards`
--
ALTER TABLE `flashcards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `flashcard_sets`
--
ALTER TABLE `flashcard_sets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `quiz_results`
--
ALTER TABLE `quiz_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `study_stats`
--
ALTER TABLE `study_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `user_flashcard_status`
--
ALTER TABLE `user_flashcard_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `card_notes`
--
ALTER TABLE `card_notes`
  ADD CONSTRAINT `card_notes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `card_notes_ibfk_2` FOREIGN KEY (`flashcard_id`) REFERENCES `flashcards` (`id`);

--
-- Các ràng buộc cho bảng `drag_drop_games`
--
ALTER TABLE `drag_drop_games`
  ADD CONSTRAINT `drag_drop_games_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `drag_drop_games_ibfk_2` FOREIGN KEY (`set_id`) REFERENCES `flashcard_sets` (`id`);

--
-- Các ràng buộc cho bảng `flashcards`
--
ALTER TABLE `flashcards`
  ADD CONSTRAINT `flashcards_ibfk_1` FOREIGN KEY (`set_id`) REFERENCES `flashcard_sets` (`id`);

--
-- Các ràng buộc cho bảng `flashcard_sets`
--
ALTER TABLE `flashcard_sets`
  ADD CONSTRAINT `flashcard_sets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `quiz_results`
--
ALTER TABLE `quiz_results`
  ADD CONSTRAINT `quiz_results_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `quiz_results_ibfk_2` FOREIGN KEY (`set_id`) REFERENCES `flashcard_sets` (`id`);

--
-- Các ràng buộc cho bảng `study_stats`
--
ALTER TABLE `study_stats`
  ADD CONSTRAINT `study_stats_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `user_flashcard_status`
--
ALTER TABLE `user_flashcard_status`
  ADD CONSTRAINT `user_flashcard_status_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_flashcard_status_ibfk_2` FOREIGN KEY (`flashcard_id`) REFERENCES `flashcards` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
