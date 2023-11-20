-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-11-2023 a las 01:09:21
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `qr_app`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `consult`
--

CREATE TABLE `consult` (
  `idConsult` int(11) NOT NULL,
  `name` varchar(250) NOT NULL DEFAULT 'Nombre de la llamada',
  `token` varchar(255) NOT NULL DEFAULT 'Token de la llamada',
  `typeDate` tinyint(4) NOT NULL DEFAULT 0,
  `dateFrom` timestamp NOT NULL DEFAULT current_timestamp(),
  `dateTo` timestamp NOT NULL DEFAULT current_timestamp(),
  `number` int(11) NOT NULL DEFAULT 0,
  `unit` tinyint(4) NOT NULL DEFAULT 1,
  `filters` longtext NOT NULL DEFAULT '{}',
  `operation` tinyint(4) NOT NULL DEFAULT 1,
  `chart` tinyint(4) NOT NULL DEFAULT 0,
  `activated` int(4) NOT NULL DEFAULT 0,
  `qrCode` int(11) NOT NULL,
  `orderConsult` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `consult`
--

INSERT INTO `consult` (`idConsult`, `name`, `token`, `typeDate`, `dateFrom`, `dateTo`, `number`, `unit`, `filters`, `operation`, `chart`, `activated`, `qrCode`, `orderConsult`) VALUES
(1, 'Consumo eléctrico del sensor MLU00040001', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk3NjQxOTF9.ZyZoVHLgFTwneop0pxn0yW059FUmTI92bnUIlklPHmQ', 0, '2023-05-19 03:00:00', '2023-05-19 05:00:00', 0, 1, '{\"uid\":\"MLU00040001\",\"name\":\"15m\"}', 4, 3, 1, 3, 0),
(6, 'Gráfica de líneas con dos sensores', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk3NjQxOTF9.ZyZoVHLgFTwneop0pxn0yW059FUmTI92bnUIlklPHmQ', 0, '2023-07-06 12:21:30', '2023-07-27 12:21:30', 0, 1, '{\"uid\":\"MLU00040001,MLU02000002\",\"name\":\"15m\"}', 1, 0, 1, 3, 2),
(8, 'Gráfica de barras 2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk3NjQxOTF9.ZyZoVHLgFTwneop0pxn0yW059FUmTI92bnUIlklPHmQ', 0, '2023-07-05 22:00:00', '2023-07-06 22:00:00', 0, 1, '{\"uid\":\"MLU00080001,MLU00090001,MLU00200002\",\"name\":\"15m\"}', 1, 1, 1, 3, 1),
(35, 'Nombre de la llamada', 'Token de la llamada', 0, '2023-09-22 11:40:20', '2023-10-07 11:40:20', 0, 1, '{}', 1, 0, 1, 6, 0),
(36, 'Nombre de la llamada', 'Token de la llamada', 0, '2023-09-22 11:40:21', '2023-10-07 11:40:21', 0, 1, '{}', 1, 0, 1, 6, 1),
(37, 'Nombre de la llamada', 'Token de la llamada', 0, '2023-09-22 11:40:22', '2023-10-07 11:40:22', 0, 1, '{}', 1, 0, 1, 6, 2),
(38, 'Nombre de la llamada', 'Token de la llamada', 0, '2023-09-22 11:44:34', '2023-10-07 11:44:34', 0, 1, '{}', 1, 0, 1, 6, 3),
(56, 'Pruebas', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk3NjQxOTF9.ZyZoVHLgFTwneop0pxn0yW059FUmTI92bnUIlklPHmQ', 0, '2023-09-27 09:29:17', '2023-10-12 09:29:17', 0, 1, '{}', 1, 0, 0, 3, 3),
(103, 'Nombre de la llamada', 'Token de la llamada', 0, '2023-11-12 20:57:40', '2023-11-27 20:57:40', 0, 0, '{}', 1, 0, 0, 3, 4),
(104, 'Nombre de la llamada', 'Token de la llamada', 0, '2023-11-12 21:09:43', '2023-11-27 21:09:42', 0, 1, '{}', 1, 0, 0, 3, 5),
(114, 'Nombre de la llamada', 'Token de la llamada', 0, '2023-11-13 00:12:02', '2023-11-20 00:12:02', 0, 1, '{}', 1, 0, 0, 257, 0),
(115, 'Nombre de la llamada', 'Token de la llamada', 0, '2023-11-13 00:12:02', '2023-11-20 00:12:02', 0, 1, '{}', 1, 0, 0, 257, 1),
(116, 'Nombre de la llamada', 'Token de la llamada', 0, '2023-11-13 00:12:02', '2023-11-20 00:12:02', 0, 1, '{}', 1, 0, 0, 257, 2),
(118, 'Nombre de la llamada', 'Token de la llamada', 0, '2023-11-13 00:12:02', '2023-11-20 00:12:02', 0, 1, '{}', 1, 0, 0, 3, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `qrcode`
--

CREATE TABLE `qrcode` (
  `idQr` int(11) NOT NULL,
  `description` text NOT NULL DEFAULT 'Descripción del código QR',
  `tagName` varchar(250) NOT NULL DEFAULT 'Nombre de etiqueta',
  `tagDescription` varchar(250) NOT NULL DEFAULT 'Descripción de etiqueta',
  `sizePrint` varchar(4) NOT NULL DEFAULT 'a4',
  `date` date NOT NULL DEFAULT current_timestamp(),
  `activated` tinyint(4) NOT NULL DEFAULT 0,
  `share` tinyint(4) NOT NULL DEFAULT 0,
  `user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `qrcode`
--

INSERT INTO `qrcode` (`idQr`, `description`, `tagName`, `tagDescription`, `sizePrint`, `date`, `activated`, `share`, `user`) VALUES
(3, 'Consumo electrónico', 'Primer QR', 'Prueba', 'a4', '2023-11-30', 1, 1, 10),
(6, 'Se va a probar update en este código Qr', 'Postman fecha', 'admin prueba', 'a4', '2024-01-07', 1, 0, 10),
(257, 'No deberia pasar', '', '', 'a4', '2023-11-25', 0, 0, 4),
(258, 'dadaa', '', '', 'a4', '2023-12-09', 0, 0, 4),
(265, 'Descripción del código QR', 'Nombre de etiqueta', 'pruebita', '\'a4\'', '2023-11-28', 0, 0, 4),
(268, 'prueba solo insertId update', '', '', 'a4', '2023-12-10', 0, 0, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `idUser` int(11) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `role` tinyint(4) NOT NULL,
  `lim_consult` int(4) NOT NULL DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`idUser`, `email`, `password`, `role`, `lim_consult`) VALUES
(2, 'jd@gmail.com', '$2a$10$/etleNsk6r0uucYHj1INzeSLUyrNRY6be74Dmml5NjI27Qt0znMFS', 1, 10),
(4, 'userpass@gmail.com', '$2a$10$TpNX4WQ52y9nuAypqmrsqeVqbq5.YhjtEvQpqTwD8Sd1I5lx5nPNi', 1, 0),
(6, 'pruUpdate@gmail.com', '$2a$10$Z9E41Lv.bI24NnNe3qWYJerTgwoWfAlCys6OwXZOn0kCW0.XBvcv.', 0, 10),
(10, 'pru2@gmail.com', '$2a$10$Jhc4HiCjOXfzKuKby0gq7OgaOuJRILPLx29e7e7uulQPyEigQG..e', 0, 10),
(19, 'josedanielnemejerez@gmail.com', '$2a$10$j77aFW9uGcINnko.pW12aeK478.c0t70ciFgGxH3uUMI0Mlp2fsaK', 1, 12),
(29, 'postman2@gmail.com', '$2a$10$hIHHRbeeDCBRKFHbuEXrV.Z0FXJCkaM0rOOp8XXHe99Wno7Wuxfri', 0, 21),
(33, 'mysql2@gmail.com', '$2a$10$BW0hHRdmYpLmHVXIQUWEUu6ZE9fBkx1UbNmCX1Zh2biy9CTkwZ.IS', 0, 10),
(36, 'newpass@gmail.com', '$2a$10$vegBTsgqsRRXSt9a77wIQ.1at8buQjmrfVlXxrbMoW1S0ZQF6Pb7i', 0, 10);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `consult`
--
ALTER TABLE `consult`
  ADD PRIMARY KEY (`idConsult`),
  ADD KEY `qrCode` (`qrCode`);

--
-- Indices de la tabla `qrcode`
--
ALTER TABLE `qrcode`
  ADD PRIMARY KEY (`idQr`),
  ADD KEY `user` (`user`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`idUser`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `consult`
--
ALTER TABLE `consult`
  MODIFY `idConsult` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT de la tabla `qrcode`
--
ALTER TABLE `qrcode`
  MODIFY `idQr` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=269;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `consult`
--
ALTER TABLE `consult`
  ADD CONSTRAINT `consult_ibfk_1` FOREIGN KEY (`qrCode`) REFERENCES `qrcode` (`idQr`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `qrcode`
--
ALTER TABLE `qrcode`
  ADD CONSTRAINT `qrcode_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
