-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 31-07-2023 a las 12:58:41
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

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
  `name` varchar(50) NOT NULL DEFAULT 'Nombre de la llamada',
  `token` varchar(255) NOT NULL DEFAULT 'Token de la llamada',
  `dateFrom` timestamp NOT NULL DEFAULT current_timestamp(),
  `dateTo` timestamp NOT NULL DEFAULT current_timestamp(),
  `filters` longtext NOT NULL DEFAULT '{}',
  `operation` tinyint(4) NOT NULL DEFAULT 1,
  `chart` tinyint(4) NOT NULL DEFAULT 0,
  `activated` int(4) NOT NULL DEFAULT 1,
  `qrCode` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `consult`
--

INSERT INTO `consult` (`idConsult`, `name`, `token`, `dateFrom`, `dateTo`, `filters`, `operation`, `chart`, `activated`, `qrCode`) VALUES
(1, 'Consumo de energía del sensor MLU00040001', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk3NjQxOTF9.ZyZoVHLgFTwneop0pxn0yW059FUmTI92bnUIlklPHmQ', '2023-07-24 08:22:52', '2023-07-24 08:27:52', '{\"uid\":\"MLU00040001\",\"name\":\"15m\"}', 2, 3, 1, 3),
(2, 'Segunda llamada', '32lk4j23lk4j3lk4j', '2023-07-03 09:28:15', '2023-07-03 09:28:15', '', 1, 0, 1, 6),
(3, 'Tercera llamada', '1312d112d1d12d12d12d12d12d12d', '2023-07-01 09:28:45', '2023-07-03 09:28:45', '', 1, 0, 1, 7),
(6, 'Gráfica de líneas con dos sensores', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk3NjQxOTF9.ZyZoVHLgFTwneop0pxn0yW059FUmTI92bnUIlklPHmQ', '2023-07-06 12:21:30', '2023-07-27 12:21:30', '{\"uid\":\"MLU00040001,MLU02000002\",\"name\":\"15m\"}', 1, 0, 1, 3),
(8, 'Gráfica de barras', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk3NjQxOTF9.ZyZoVHLgFTwneop0pxn0yW059FUmTI92bnUIlklPHmQ', '2023-07-05 22:00:00', '2023-07-06 22:00:00', '{\"uid\":\"MLU00080001,MLU00090001,MLU00200002\",\"name\":\"15m\"}', 1, 1, 1, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `qrcode`
--

CREATE TABLE `qrcode` (
  `idQr` int(11) NOT NULL,
  `description` text NOT NULL DEFAULT 'Descripción del código QR',
  `tagName` varchar(50) NOT NULL DEFAULT 'Nombre de etiqueta',
  `tagDescription` varchar(50) NOT NULL DEFAULT 'Descripción de etiqueta',
  `date` date NOT NULL DEFAULT current_timestamp(),
  `activated` tinyint(4) NOT NULL DEFAULT 1,
  `user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `qrcode`
--

INSERT INTO `qrcode` (`idQr`, `description`, `tagName`, `tagDescription`, `date`, `activated`, `user`) VALUES
(3, 'Colección de consumo electrónico', 'Primer QR.', 'Descripción del primer QR', '2023-07-05', 1, 10),
(6, 'Se va a probar update en este código Qr', 'Postman fecha', 'prueba update', '2023-06-27', 1, 10),
(7, 'Otro QR de prueba ', 'Qr Prueba', 'Otro Qr de prueba', '2023-07-09', 1, 4),
(8, '\'Descripción del código QR\'', 'Nombre de etiqueta', 'Descripción de etiqueta', '2023-07-04', 1, 10),
(13, 'QR con pruebas realizadas', 'Nombre de etiqueta', 'Descripción de etiqueta', '2023-07-05', 1, 4),
(16, 'Descripción del código QR', 'Nombre de etiqueta', 'Descripción de etiqueta', '2023-07-07', 1, 4),
(17, 'Descripción del código QR', 'Nombre de etiqueta', 'Descripción de etiqueta', '2023-07-21', 1, 4),
(18, 'Descripción del código QR', 'Nombre de etiqueta', 'Descripción de etiqueta', '2023-07-21', 1, 4),
(19, 'Descripción del código QR', 'Nombre de etiqueta', 'Descripción de etiqueta', '2023-07-21', 1, 4),
(20, 'Descripción del código QR', 'Nombre de etiqueta', 'Descripción de etiqueta', '2023-07-21', 1, 4),
(24, 'Descripción del código QR', 'Nombre de etiqueta', 'Descripción de etiqueta', '2023-07-21', 1, 4);

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
(1, 'usu@gmail.com', '1234', 0, 27),
(2, 'jd@gmail.com', '1234', 1, 10),
(4, 'userpass@gmail.com', '$2a$10$8id1jikCrKB0EWpjbcnZiO4G6GexAZpKx5O4GoB9xt9HfQ/KwMYCi', 1, 11),
(6, 'pruUpdate@gmail.com', '$2a$10$SzQSeyKmOVpkbcREOe9DZukC3YdVp6MiTDHwTy6dbWIeiQsBFCEye', 0, 10),
(10, 'pru2@gmail.com', '$2a$10$Jhc4HiCjOXfzKuKby0gq7OgaOuJRILPLx29e7e7uulQPyEigQG..e', 0, 10),
(14, 'formusu@gmail.com', '$2a$10$Yqf8xlmdZ91C8Erg1lxQHuibXrsrtOc2gel1TbbG1F8SBxd4o4NI2', 0, 10),
(15, 'cambioApi@gmail.com', '$2a$10$SXu5wRQDBuWSH6Dn85K3peB/qJFCzXL8xkB4bv11yOjYMQnhGVFsy', 1, 15),
(19, 'josedanielnemejerez@gmail.com', '$2a$10$Qy3IfYFYxYxxqKr9obvmY.4f4A8vVyZ5/UrlfU2wOk21FFupsjvYq', 1, 10);

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
  MODIFY `idConsult` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `qrcode`
--
ALTER TABLE `qrcode`
  MODIFY `idQr` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

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
