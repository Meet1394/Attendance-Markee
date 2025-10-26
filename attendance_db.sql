-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 26, 2025 at 01:34 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `attendance_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `status` enum('present','absent','late') NOT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `student_id`, `date`, `status`, `teacher_id`, `remarks`, `created_at`) VALUES
(1, 1, '2025-10-26', 'present', 2, NULL, '2025-10-26 10:25:08'),
(2, 2, '2025-10-26', 'present', 2, NULL, '2025-10-26 10:25:08'),
(3, 3, '2025-10-26', 'present', 2, NULL, '2025-10-26 10:25:08'),
(4, 4, '2025-10-26', 'late', 1, NULL, '2025-10-26 10:25:08'),
(5, 5, '2025-10-26', 'present', 1, NULL, '2025-10-26 10:25:08'),
(6, 6, '2025-10-26', 'present', 2, NULL, '2025-10-26 10:25:08'),
(7, 7, '2025-10-26', 'present', 2, NULL, '2025-10-26 10:25:08'),
(8, 8, '2025-10-26', 'present', 2, NULL, '2025-10-26 10:25:08'),
(12, 2, '2025-10-27', 'late', 1, NULL, '2025-10-26 11:52:19'),
(14, 3, '2025-10-27', 'absent', 1, NULL, '2025-10-26 11:52:45'),
(15, 4, '2025-10-27', 'absent', 1, NULL, '2025-10-26 11:52:49'),
(16, 10, '2025-10-27', 'present', 1, NULL, '2025-10-26 11:52:49'),
(17, 11, '2025-10-27', 'present', 1, NULL, '2025-10-26 11:52:50'),
(18, 13, '2025-10-27', 'present', 1, NULL, '2025-10-26 11:52:51'),
(19, 15, '2025-10-27', 'present', 1, NULL, '2025-10-26 11:52:51'),
(20, 6, '2025-10-27', 'present', 1, NULL, '2025-10-26 11:52:52'),
(22, 12, '2025-10-27', 'present', 1, NULL, '2025-10-26 11:52:55'),
(23, 9, '2025-10-27', 'present', 1, NULL, '2025-10-26 11:52:55'),
(24, 8, '2025-10-27', 'present', 1, NULL, '2025-10-26 11:52:55'),
(25, 7, '2025-10-27', 'present', 1, NULL, '2025-10-26 11:52:56'),
(26, 1, '2025-10-27', 'present', 1, NULL, '2025-10-26 11:53:29'),
(28, 12, '2025-10-26', 'absent', 2, NULL, '2025-10-26 11:53:48'),
(29, 9, '2025-10-26', 'absent', 2, NULL, '2025-10-26 11:53:48'),
(33, 15, '2025-10-26', 'present', 2, NULL, '2025-10-26 11:53:50'),
(34, 13, '2025-10-26', 'absent', 2, NULL, '2025-10-26 11:53:51'),
(35, 11, '2025-10-26', 'present', 2, NULL, '2025-10-26 11:53:52'),
(36, 10, '2025-10-26', 'absent', 1, NULL, '2025-10-26 11:53:52'),
(37, 3, '2025-10-28', 'present', 1, NULL, '2025-10-26 11:54:05'),
(38, 1, '2025-10-29', 'absent', 1, NULL, '2025-10-26 11:54:32'),
(39, 12, '2025-10-30', 'present', 1, NULL, '2025-10-26 11:54:44'),
(54, 3, '2025-10-31', 'present', 2, NULL, '2025-10-26 12:16:28'),
(55, 1, '2025-10-31', 'present', 2, NULL, '2025-10-26 12:16:28'),
(56, 2, '2025-10-31', 'late', 2, NULL, '2025-10-26 12:16:28'),
(57, 4, '2025-10-31', 'absent', 2, NULL, '2025-10-26 12:16:28'),
(58, 5, '2025-10-31', 'present', 2, NULL, '2025-10-26 12:16:28'),
(59, 6, '2025-10-31', 'present', 2, NULL, '2025-10-26 12:16:28'),
(60, 11, '2025-10-31', 'present', 2, NULL, '2025-10-26 12:16:28'),
(61, 8, '2025-10-31', 'present', 2, NULL, '2025-10-26 12:16:28'),
(62, 7, '2025-10-31', 'present', 2, NULL, '2025-10-26 12:16:28'),
(63, 10, '2025-10-31', 'present', 2, NULL, '2025-10-26 12:16:28'),
(64, 9, '2025-10-31', 'absent', 2, NULL, '2025-10-26 12:16:28'),
(65, 12, '2025-10-31', 'absent', 2, NULL, '2025-10-26 12:16:28'),
(67, 13, '2025-10-31', 'absent', 2, NULL, '2025-10-26 12:16:28'),
(68, 15, '2025-10-31', 'present', 2, NULL, '2025-10-26 12:16:28');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `roll_number` varchar(50) NOT NULL,
  `class` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `name`, `roll_number`, `class`, `created_at`) VALUES
(1, 'Rahul Sharma', '001', '10B', '2025-10-26 10:25:08'),
(2, 'Priya Sharma', '002', '10A', '2025-10-26 10:25:08'),
(3, 'Amit Kumar', '003', '10A', '2025-10-26 10:25:08'),
(4, 'Sneha Singh', '004', '10A', '2025-10-26 10:25:08'),
(5, 'Arjun Verma', '005', '10A', '2025-10-26 10:25:08'),
(6, 'Kavya Reddy', '006', '10B', '2025-10-26 10:25:08'),
(7, 'Rohan Gupta', '007', '10B', '2025-10-26 10:25:08'),
(8, 'Ananya Mehta', '008', '10B', '2025-10-26 10:25:08'),
(9, 'Vikram Shah', '009', '10B', '2025-10-26 10:25:08'),
(10, 'Ishita Joshi', '010', '10A', '2025-10-26 10:25:08'),
(11, 'Aditya Nair', '011', '10A', '2025-10-26 10:25:08'),
(12, 'Meera Iyer', '012', '10B', '2025-10-26 10:25:08'),
(13, 'Karan Malhotra', '013', '10A', '2025-10-26 10:25:08'),
(15, 'Ravi Krishnan', '015', '10A', '2025-10-26 10:25:08');

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`id`, `email`, `password`, `name`, `created_at`) VALUES
(1, 'teacher@school.com', 'teacher123', 'Demo Teacher', '2025-10-26 10:25:08'),
(2, 'john.doe@school.com', 'password123', 'John Doe', '2025-10-26 10:25:08'),
(3, 'jane.smith@school.com', 'password123', 'Jane Smith', '2025-10-26 10:25:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_attendance` (`student_id`,`date`),
  ADD KEY `teacher_id` (`teacher_id`),
  ADD KEY `idx_date` (`date`),
  ADD KEY `idx_student_id` (`student_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roll_number` (`roll_number`),
  ADD KEY `idx_roll_number` (`roll_number`),
  ADD KEY `idx_class` (`class`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
