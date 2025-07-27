-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th7 23, 2025 lúc 09:49 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `nihoncard`
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
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(4, 8, '人生', '人生の語彙', '2025-07-17 13:51:28'),
(5, 8, '果物', 'いろいろな果物の言葉を勉強しましょう　！！', '2025-07-17 13:55:42'),
(6, 3, 'PHONG CẢNH', 'Từ vựng về Phong cảnh', '2025-07-17 15:47:50'),
(7, 3, 'ffff', NULL, '2025-07-21 03:44:39'),
(8, 3, 'hghjgh', NULL, '2025-07-22 04:07:55');

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
(8, 'minh', '$2b$10$b4maqsX.GBrQ12i9Gu/xwO8cShpdtGcy7HCyUI7elzir1zpoLhNrC', '2025-07-17 13:50:27');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `flashcard_sets`
--
ALTER TABLE `flashcard_sets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
