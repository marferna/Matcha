SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `block_user` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_block` int(11) NOT NULL,
  `block` int(11) NOT NULL
);

CREATE TABLE IF NOT EXISTS `chat` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `user1` int(11) NOT NULL,
  `user2` int(255) NOT NULL,
  `login1` varchar(255) NOT NULL,
  `login2` varchar(255) NOT NULL,
  `avatar1` varchar(255) NOT NULL,
  `avatar2` varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS `ct_interet` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `interet` varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS `likes_match` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_stalk` int(11) NOT NULL,
  `like_button` int(11) NOT NULL
);

CREATE TABLE IF NOT EXISTS `match_users` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `user1` int(11) NOT NULL,
  `user2` int(11) NOT NULL
);

CREATE TABLE IF NOT EXISTS `message_chat` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `user1` int(11) NOT NULL,
  `user2` int(11) NOT NULL,
  `message` varchar(255) NOT NULL,
  `user_from` int(11) NOT NULL,
  `creation_time` datetime NOT NULL
);

CREATE TABLE IF NOT EXISTS `notif` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_stalk` int(11) NOT NULL,
  `notif` varchar(255) NOT NULL,
  `lu` int(11) NOT NULL
);

CREATE TABLE IF NOT EXISTS `photos` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `photo_1` text NOT NULL,
  `photo_2` text NOT NULL,
  `photo_3` text NOT NULL,
  `photo_4` text NOT NULL,
  `photo_5` text NOT NULL
);
CREATE TABLE IF NOT EXISTS `report_user` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_report` int(11) NOT NULL
);

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `login` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `passwd` text NOT NULL,
  `genre` varchar(255) NOT NULL,
  `interest` varchar(255) NOT NULL,
  `bio` text NOT NULL,
  `confirm_mail` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `reset_passwd` varchar(255) NOT NULL,
  `score` int(11) NOT NULL,
  `latitude` varchar(255) NOT NULL,
  `longitude` varchar(255) NOT NULL,
  `log` varchar(255) NOT NULL
);